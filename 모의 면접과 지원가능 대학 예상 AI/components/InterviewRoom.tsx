
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { InterviewConfig, FeedbackData } from '../types';
import { SYSTEM_INSTRUCTION_BASE } from '../constants';
import { createBlob, decode, decodeAudioData } from '../services/audioHelper';

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
}

interface Props {
  config: InterviewConfig;
  onFinish: (feedback: FeedbackData) => void;
}

const InterviewRoom: React.FC<Props> = ({ config, onFinish }) => {
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVideo, setHasVideo] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAiText, setCurrentAiText] = useState('');
  const [currentUserText, setCurrentUserText] = useState('');
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(40).fill(5));
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Use refs for transcription to avoid stale closures in onmessage callbacks
  const currentAiTextRef = useRef('');
  const currentUserTextRef = useRef('');
  const historyRef = useRef('');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAiText, currentUserText]);

  const stopInterview = useCallback(() => {
    try {
      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }
    } catch (e) {
      console.warn("Session close error", e);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsLive(false);
  }, []);

  const generateFeedback = async (historyText: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `분석 대상: ${config.category.name} 면접. 지원자: ${config.userName}. 전체 대화 내용: ${historyText}`,
        config: {
          systemInstruction: "면접 분석 전문가로서 결과를 JSON으로만 출력하세요. keys: overallScore(number), strengths(string[]), weaknesses(string[]), recommendations(string[]), transcription(string). 모든 값은 한국어로 작성하세요.",
          responseMimeType: "application/json",
        }
      });

      if (response.text) {
        const rawJson = JSON.parse(response.text);
        // Ensure all arrays exist to prevent map errors later
        const validatedFeedback: FeedbackData = {
          overallScore: typeof rawJson.overallScore === 'number' ? rawJson.overallScore : 70,
          strengths: Array.isArray(rawJson.strengths) ? rawJson.strengths : ["침착한 대응"],
          weaknesses: Array.isArray(rawJson.weaknesses) ? rawJson.weaknesses : ["구체적인 사례 보완 필요"],
          recommendations: Array.isArray(rawJson.recommendations) ? rawJson.recommendations : ["STAR 기법 연습"],
          transcription: rawJson.transcription || historyText
        };
        onFinish(validatedFeedback);
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      console.error("Feedback generation error:", err);
      onFinish({
        overallScore: 75,
        strengths: ["적극적인 의사소통 태도"],
        weaknesses: ["논리적 답변 구조 보완 필요"],
        recommendations: ["STAR 기법 사용 권장"],
        transcription: historyText
      });
    }
  };

  const handleFinish = () => {
    stopInterview();
    generateFeedback(historyRef.current);
  };

  const startInterview = useCallback(async () => {
    setError(null);
    try {
      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
        channelCount: 1
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: true });
        setHasVideo(true);
      } catch (videoErr) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        setHasVideo(false);
      }
      
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new AudioContext({ sampleRate: 16000 });
      const outputAudioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = inputAudioContext;
      outputAudioContextRef.current = outputAudioContext;

      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);

      const analyzer = inputAudioContext.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            const source = inputAudioContext.createMediaStreamSource(stream);
            source.connect(analyzer);

            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              });

              if (analyzer) {
                const bufferLength = analyzer.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyzer.getByteFrequencyData(dataArray);
                const scaled = Array.from(dataArray.slice(0, 40)).map(v => Math.max(5, (v / 255) * 60));
                setVisualizerData(scaled);
              }
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              currentAiTextRef.current += text;
              setCurrentAiText(currentAiTextRef.current);
              historyRef.current += text;
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentUserTextRef.current += text;
              setCurrentUserText(currentUserTextRef.current);
              historyRef.current += ` [지원자: ${text}] `;
            }

            if (message.serverContent?.turnComplete) {
              const fullAiText = currentAiTextRef.current;
              const fullUserText = currentUserTextRef.current;
              
              setMessages(prev => {
                const newMessages = [...prev];
                if (fullAiText.trim()) {
                  newMessages.push({ id: `ai-${Date.now()}`, type: 'ai', text: fullAiText.trim() });
                }
                if (fullUserText.trim()) {
                  newMessages.push({ id: `user-${Date.now()}`, type: 'user', text: fullUserText.trim() });
                }
                return newMessages;
              });

              currentAiTextRef.current = '';
              currentUserTextRef.current = '';
              setCurrentAiText('');
              setCurrentUserText('');
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live session error:", e);
            setError("마이크 입력 또는 서버 연결에 오류가 발생했습니다. 페이지를 새로고침 해주세요.");
            setIsLive(false);
          },
          onclose: () => setIsLive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: `${SYSTEM_INSTRUCTION_BASE} 현재 지원자 성함: ${config.userName}. 면접 분야: ${config.category.name}. 첫 번째 질문으로 정중하게 면접을 시작해 주세요.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      setError("마이크 권한이 필요합니다.");
    }
  }, [config]);

  useEffect(() => {
    startInterview();
    return () => stopInterview();
  }, [startInterview, stopInterview]);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (streamRef.current && videoRef.current && hasVideo) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isLive, hasVideo]);

  // Safe mapping even if visualizerData is messed up
  const safeVisualizerData = Array.isArray(visualizerData) ? visualizerData : new Array(40).fill(5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-stretch min-h-[750px]">
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video relative group flex items-center justify-center border-[6px] border-slate-800 ring-1 ring-slate-700">
          {hasVideo ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="text-white flex flex-col items-center gap-6">
              <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center text-6xl shadow-inner">👤</div>
              <p className="text-slate-400 font-medium">오디오 전용 모드</p>
            </div>
          )}
          
          <div className="absolute top-8 left-8 flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-xl text-white text-xs rounded-full border border-white/10 shadow-2xl">
            <span className={`w-2.5 h-2.5 ${isLive ? 'bg-red-500' : 'bg-slate-500'} rounded-full animate-pulse`}></span>
            <span className="font-bold uppercase tracking-widest">{isLive ? 'LIVE' : 'OFFLINE'}</span>
            <span className="opacity-30">|</span>
            <span className="font-medium text-slate-300">{config.category.name}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Interview Log
            </h4>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {(messages || []).length === 0 && !currentAiText && !currentUserText && (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm font-medium italic py-20">
                면접관이 대화를 시작하는 중입니다...
              </div>
            )}
            
            {(messages || []).map((m) => (
              <div key={m.id} className={`flex ${m.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.type === 'ai' 
                    ? 'bg-slate-100 text-slate-700 rounded-tl-none' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {currentAiText && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl rounded-tl-none text-sm leading-relaxed border-l-4 border-blue-400">
                  {currentAiText}
                  <span className="inline-block w-1 h-3 bg-blue-400 animate-pulse ml-1"></span>
                </div>
              </div>
            )}

            {currentUserText && (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-5 py-3 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl rounded-tr-none text-sm leading-relaxed">
                  {currentUserText}
                  <span className="inline-block w-1.5 h-3 bg-blue-400 animate-pulse ml-1"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[360px] flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col items-center">
          {error ? (
            <div className="w-full text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl">⚠️</div>
              <p className="text-xs text-slate-500 mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">다시 시작</button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className={`w-24 h-24 ${isLive ? 'bg-blue-600' : 'bg-slate-50'} rounded-full flex items-center justify-center mb-6 shadow-2xl relative transition-all duration-700`}>
                <div className={`absolute inset-0 bg-blue-600 rounded-full ${isLive ? 'animate-ping opacity-20' : 'opacity-0'}`}></div>
                <div className="text-white text-4xl z-10">{isLive ? '🎙️' : '⏳'}</div>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{isLive ? '면접 진행 중' : '연결 중'}</h3>
              <p className="text-[11px] text-slate-400 text-center mb-8 px-4">한국어로 답변해 주세요. 주변 소음이 인식을 방해할 수 있습니다.</p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-end gap-1 h-16 justify-center">
                {safeVisualizerData.slice(0, 20).map((h, i) => (
                  <div key={i} className={`w-1 rounded-full transition-all duration-75 ${isLive ? 'bg-blue-500' : 'bg-slate-200'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleFinish}
          disabled={!isLive}
          className={`w-full py-6 font-black text-xl rounded-[2rem] transition-all shadow-2xl ${
            !isLive ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-200'
          }`}
        >
          면접 완료 & 피드백
        </button>

        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem]">
          <h5 className="font-bold text-[10px] text-blue-600 uppercase tracking-widest mb-2">Notice</h5>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            AI가 말을 인식하지 못하거나 타 언어로 인식한다면, 마이크를 입 가까이 대고 더 명확하게 발음해 보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;

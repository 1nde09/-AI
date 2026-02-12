
import React, { useState, useCallback } from 'react';
import { AppStatus, InterviewMode, Category, InterviewConfig, FeedbackData, GradeData, AdmissionResult } from './types';
import { JOB_CATEGORIES, UNIVERSITY_CATEGORIES } from './constants';
import Layout from './components/Layout';
import InterviewRoom from './components/InterviewRoom';
import ResultScreen from './components/ResultScreen';
import GradeInputScreen from './components/GradeInputScreen';
import PredictorResultScreen from './components/PredictorResultScreen';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.HOME);
  const [mode, setMode] = useState<InterviewMode | null>(null);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [admissionResult, setAdmissionResult] = useState<AdmissionResult | null>(null);
  const [userName, setUserName] = useState('');

  const handleSelectMode = (m: InterviewMode) => {
    setMode(m);
    setStatus(AppStatus.PICK_CATEGORY);
    window.scrollTo(0, 0);
  };

  const handleSelectCategory = (c: Category) => {
    if (!mode) return;
    setConfig({ mode, category: c, userName: userName || '지원자' });
    setStatus(AppStatus.PREP);
    window.scrollTo(0, 0);
  };

  const handleFinishInterview = (fb: FeedbackData) => {
    setFeedback(fb);
    setStatus(AppStatus.RESULT);
    window.scrollTo(0, 0);
  };

  const handlePredictResult = (result: AdmissionResult) => {
    setAdmissionResult(result);
    setStatus(AppStatus.PREDICTOR_RESULT);
    window.scrollTo(0, 0);
  };

  const reset = useCallback(() => {
    setStatus(AppStatus.HOME);
    setMode(null);
    setConfig(null);
    setFeedback(null);
    setAdmissionResult(null);
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout onLogoClick={reset}>
      <div className="py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {status === AppStatus.HOME && (
          <div className="max-w-6xl mx-auto text-center relative">
            <span className="inline-block px-6 py-2 mb-8 text-xs font-black tracking-[0.2em] text-indigo-600 uppercase bg-indigo-50 rounded-full border border-indigo-100 shadow-sm animate-bounce">
              PREMIUM ADMISSION AI SERVICE
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tighter">
              대한민국 입시의 <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent">최정상 지능을 경험하세요</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
              단순한 모의 면접을 넘어, 실시간 입시 데이터 분석과 <br className="hidden md:block"/>
              정밀 성적 예측으로 당신의 합격 가능성을 극대화합니다.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center relative z-10">
              <button 
                onClick={() => handleSelectMode(InterviewMode.JOB)}
                className="group relative px-8 py-10 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-[3rem] shadow-xl hover:shadow-2xl hover:border-indigo-500 hover:-translate-y-2 transition-all text-left flex flex-col items-start gap-6 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">💼</div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 mb-2">취업 / 이직 면접</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">최신 트렌드를 반영한 AI 실전 모의 면접 시뮬레이션</p>
                </div>
              </button>
              
              <button 
                onClick={() => handleSelectMode(InterviewMode.UNIVERSITY)}
                className="group relative px-8 py-10 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-[3rem] shadow-xl hover:shadow-2xl hover:border-blue-500 hover:-translate-y-2 transition-all text-left flex flex-col items-start gap-6 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">🎓</div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 mb-2">대학 입시 면접</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">대학별 제시문 및 학생부 기반 심층 분석 면접</p>
                </div>
              </button>

              <button 
                onClick={() => { setStatus(AppStatus.PREDICTOR_INPUT); window.scrollTo(0, 0); }}
                className="group relative px-8 py-10 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-[3rem] shadow-xl hover:shadow-2xl hover:border-emerald-500 hover:-translate-y-2 transition-all text-left flex flex-col items-start gap-6 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">📊</div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 mb-2">대학 합격 분석</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">표점/백분위 기반 최신 입시 컷라인 정밀 분석</p>
                </div>
              </button>
            </div>

            {/* 홈 화면 추가 데코레이션 */}
            <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center justify-center gap-2 font-black text-slate-400">GEMINI AI</div>
              <div className="flex items-center justify-center gap-2 font-black text-slate-400">LIVE VOICE</div>
              <div className="flex items-center justify-center gap-2 font-black text-slate-400">SEARCH GROUNDING</div>
              <div className="flex items-center justify-center gap-2 font-black text-slate-400">REAL-TIME DATA</div>
            </div>
          </div>
        )}

        {status === AppStatus.PICK_CATEGORY && (
          <div className="max-w-6xl mx-auto">
            <button onClick={() => { setStatus(AppStatus.HOME); window.scrollTo(0, 0); }} className="mb-10 text-sm font-black text-indigo-400 hover:text-indigo-600 transition-colors flex items-center gap-2 uppercase tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              메인으로 이동
            </button>
            <div className="mb-16">
              <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
                {mode === InterviewMode.JOB ? '어떤 분야를 준비하시나요?' : '목표하시는 대학을 선택하세요'}
              </h2>
              <p className="text-xl text-slate-500 font-medium">전문가 수준의 맞춤형 면접관이 배정됩니다.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(mode === InterviewMode.JOB ? JOB_CATEGORIES : UNIVERSITY_CATEGORIES).map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => handleSelectCategory(cat)}
                  className="p-10 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] hover:border-indigo-500 hover:shadow-2xl hover:-translate-y-1 transition-all text-left group"
                >
                  <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">{cat.icon}</div>
                  <h3 className="font-black text-2xl text-slate-900 mb-3">{cat.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {status === AppStatus.PREP && config && (
          <div className="max-w-2xl mx-auto text-center bg-white/80 backdrop-blur-2xl p-16 rounded-[3.5rem] shadow-2xl border border-white">
            <h2 className="text-4xl font-black mb-8 text-slate-900 tracking-tight">면접 시뮬레이션 준비</h2>
            <div className="mb-10 p-8 bg-indigo-50 rounded-[2rem] inline-block text-left w-full border border-indigo-100 shadow-inner">
              <p className="text-xs text-indigo-600 font-black mb-2 uppercase tracking-widest">Selected Session</p>
              <p className="text-2xl font-black text-indigo-900 mb-1">{config.category.name}</p>
              <p className="text-sm text-indigo-400 font-medium italic">Gemini 2.5 Flash Native Audio Enabled</p>
            </div>
            
            <div className="mb-10 text-left">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">지원자 성함</label>
              <input 
                type="text" 
                placeholder="성함을 입력해 주세요" 
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none text-lg font-bold transition-all"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="space-y-4 text-left text-sm text-slate-500 mb-12 p-6 border border-slate-100 rounded-[1.5rem] bg-slate-50/50">
              <p className="flex items-center gap-3 font-medium"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> 실제 면접처럼 바른 자세와 목소리로 답변하세요.</p>
              <p className="flex items-center gap-3 font-medium"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> 조용한 환경에서 마이크 사용을 권장합니다.</p>
            </div>

            <button 
              onClick={() => {
                setConfig({...config, userName: userName || '지원자'});
                setStatus(AppStatus.INTERVIEWING);
                window.scrollTo(0, 0);
              }}
              className="w-full py-6 bg-indigo-600 text-white font-black text-xl rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
            >
              면접관 호출하기
            </button>
          </div>
        )}

        {status === AppStatus.INTERVIEWING && config && (
          <InterviewRoom config={config} onFinish={handleFinishInterview} />
        )}

        {status === AppStatus.RESULT && feedback && (
          <ResultScreen feedback={feedback} onRestart={reset} />
        )}

        {status === AppStatus.PREDICTOR_INPUT && (
          <GradeInputScreen onPredict={handlePredictResult} onBack={reset} />
        )}

        {status === AppStatus.PREDICTOR_RESULT && admissionResult && (
          <PredictorResultScreen result={admissionResult} onRestart={reset} />
        )}
      </div>
    </Layout>
  );
};

export default App;

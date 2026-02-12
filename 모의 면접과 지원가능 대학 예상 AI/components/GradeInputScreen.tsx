
import React, { useState } from 'react';
import { GradeData, AdmissionResult } from '../types';
import { KOREAN_SUBJECTS, MATH_SUBJECTS, INQUIRY_SUBJECTS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onPredict: (result: AdmissionResult) => void;
  onBack: () => void;
}

const GradeInputScreen: React.FC<Props> = ({ onPredict, onBack }) => {
  const [grades, setGrades] = useState<GradeData>({
    koreanSubject: KOREAN_SUBJECTS[0],
    koreanStdScore: '',
    koreanPercentile: '',
    mathSubject: MATH_SUBJECTS[0],
    mathStdScore: '',
    mathPercentile: '',
    english: '',
    search1Subject: INQUIRY_SUBJECTS[0],
    search1StdScore: '',
    search1Percentile: '',
    search2Subject: INQUIRY_SUBJECTS[1],
    search2StdScore: '',
    search2Percentile: '',
    gpa: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `지원자 성적 상세 분석 요청:
      - 국어: ${grades.koreanSubject} (표준점수: ${grades.koreanStdScore}, 백분위: ${grades.koreanPercentile}%)
      - 수학: ${grades.mathSubject} (표준점수: ${grades.mathStdScore}, 백분위: ${grades.mathPercentile}%)
      - 영어: ${grades.english}등급
      - 탐구1: ${grades.search1Subject} (표준점수: ${grades.search1StdScore}, 백분위: ${grades.search1Percentile}%)
      - 탐구2: ${grades.search2Subject} (표준점수: ${grades.search2StdScore}, 백분위: ${grades.search2Percentile}%)
      - 내신(평균등급): ${grades.gpa || '미기입'}
      
      위 성적(표준점수와 백분위 모두 고려)을 바탕으로 2025학년도 입시 예상 컷라인을 Google 검색으로 실시간 확인하여 분석해 주세요. 
      특히 표준점수와 백분위의 차이에 따른 유리한 대학 반영 방식을 고려하세요.
      결과는 무조건 JSON 형식으로만 출력하세요. 
      구조: { "universities": [{ "name": "대학명", "major": "추천학과", "type": "SAFE|TARGET|REACH", "reason": "이유" }], "advice": "전체 입시 전략 조언" }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
          title: chunk.web?.title || '입시 정보 출처',
          uri: chunk.web?.uri || '#'
        })) || [];
        
        onPredict({ ...data, sources });
      }
    } catch (error) {
      console.error(error);
      alert("분석 중 오류가 발생했습니다. 성적을 올바르게 입력했는지 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGrades({ ...grades, [e.target.name]: e.target.value });
  };

  const InputGroup = ({ label, subjectName, stdName, perName, subjects }: any) => (
    <div className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
      <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">{label}</label>
      <div className="flex flex-col gap-3">
        {subjects && (
          <select name={subjectName} value={(grades as any)[subjectName]} onChange={handleChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-medium">
            {subjects.map((s: string) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input required name={stdName} value={(grades as any)[stdName]} onChange={handleChange} type="text" placeholder="표준점수" className="w-full p-4 pl-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">표점</span>
          </div>
          <div className="flex-1 relative">
            <input required name={perName} value={(grades as any)[perName]} onChange={handleChange} type="text" placeholder="백분위" className="w-full p-4 pl-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">%</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button onClick={onBack} className="mb-8 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
        ← 메인으로 돌아가기
      </button>

      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-3">정밀 성적 분석</h2>
          <p className="text-slate-500">표준점수와 백분위를 모두 입력하여 더 정확한 AI 합격 예측을 받아보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="국어 영역" subjectName="koreanSubject" stdName="koreanStdScore" perName="koreanPercentile" subjects={KOREAN_SUBJECTS} />
            <InputGroup label="수학 영역" subjectName="mathSubject" stdName="mathStdScore" perName="mathPercentile" subjects={MATH_SUBJECTS} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">영어 등급</label>
              <input required name="english" value={grades.english} onChange={handleChange} type="text" placeholder="예: 1" className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">내신 평균 (선택)</label>
              <input name="gpa" value={grades.gpa} onChange={handleChange} type="text" placeholder="예: 1.5" className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="탐구 1" subjectName="search1Subject" stdName="search1StdScore" perName="search1Percentile" subjects={INQUIRY_SUBJECTS} />
            <InputGroup label="탐구 2" subjectName="search2Subject" stdName="search2StdScore" perName="search2Percentile" subjects={INQUIRY_SUBJECTS} />
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className="w-full py-6 bg-emerald-600 text-white font-black text-xl rounded-3xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-4 disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AI 가 합격 컷라인을 실시간 검색 중...
                </>
              ) : 'AI 정밀 분석 결과 보기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeInputScreen;

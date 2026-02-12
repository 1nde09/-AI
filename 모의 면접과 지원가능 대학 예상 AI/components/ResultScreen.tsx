
import React from 'react';
import { FeedbackData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  feedback: FeedbackData;
  onRestart: () => void;
}

const ResultScreen: React.FC<Props> = ({ feedback, onRestart }) => {
  // Ensure we have defaults if fields are missing from AI JSON
  const strengths = feedback?.strengths || [];
  const weaknesses = feedback?.weaknesses || [];
  const recommendations = feedback?.recommendations || [];
  const score = feedback?.overallScore ?? 0;

  const chartData = [
    { name: '내 점수', value: score },
    { name: '평균 합격선', value: 85 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">면접 성과 보고서</h2>
        <p className="text-slate-500">AI 면접관과의 실시간 대화를 바탕으로 분석된 결과입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-slate-400 uppercase mb-4">종합 점수</div>
          <div className={`text-6xl font-black ${score >= 80 ? 'text-green-500' : 'text-blue-600'}`}>
            {score}
          </div>
          <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-blue-600 transition-all duration-1000`} style={{ width: `${score}%` }}></div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-4">점수 비교</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
            <span className="p-1 bg-green-100 rounded-full">✓</span> 주요 강점
          </h3>
          <ul className="space-y-3">
            {strengths.length > 0 ? strengths.map((s, i) => (
              <li key={i} className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm text-slate-700">
                {s}
              </li>
            )) : (
              <li className="text-slate-400 italic text-sm">강점 분석 데이터가 없습니다.</li>
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-amber-700">
            <span className="p-1 bg-amber-100 rounded-full">!</span> 개선이 필요한 점
          </h3>
          <ul className="space-y-3">
            {weaknesses.length > 0 ? weaknesses.map((w, i) => (
              <li key={i} className="bg-white p-4 rounded-xl border-l-4 border-amber-500 shadow-sm text-slate-700">
                {w}
              </li>
            )) : (
              <li className="text-slate-400 italic text-sm">개선점 분석 데이터가 없습니다.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 text-white mb-12 shadow-xl shadow-blue-200">
        <h3 className="text-2xl font-bold mb-6">전문가 추천 학습 방향</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.length > 0 ? recommendations.map((r, i) => (
            <div key={i} className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20">
              {r}
            </div>
          )) : (
            <div className="col-span-2 text-blue-100 italic text-sm">추천 데이터가 없습니다.</div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onRestart}
          className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
        >
          새로운 모의 면접 시작
        </button>
        <button 
          onClick={() => window.print()}
          className="px-10 py-4 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
        >
          결과 리포트 출력 (PDF)
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;

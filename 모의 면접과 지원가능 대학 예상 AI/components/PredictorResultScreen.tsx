
import React from 'react';
import { AdmissionResult } from '../types';

interface Props {
  result: AdmissionResult;
  onRestart: () => void;
}

const PredictorResultScreen: React.FC<Props> = ({ result, onRestart }) => {
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'SAFE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 print:bg-emerald-50';
      case 'TARGET': return 'bg-amber-100 text-amber-700 border-amber-200 print:bg-amber-50';
      case 'REACH': return 'bg-rose-100 text-rose-700 border-rose-200 print:bg-rose-50';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeText = (type: string) => {
    switch(type) {
      case 'SAFE': return '안정 지원';
      case 'TARGET': return '적정 지원';
      case 'REACH': return '상향 지원';
      default: return type;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 print:p-0 print:m-0">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .card { border: 1px solid #e2e8f0 !important; break-inside: avoid; }
          header, footer { display: none !important; }
        }
      `}</style>

      <div className="text-center mb-12 print:mb-8">
        <h2 className="text-4xl font-black text-slate-900 mb-4">AI 대학 지원 분석 리포트</h2>
        <p className="text-slate-500">입력된 표준점수 및 백분위와 실시간 입시 데이터를 종합하여 분석한 결과입니다.</p>
        <p className="hidden print:block text-xs text-slate-400 mt-2">출력 일시: {new Date().toLocaleString('ko-KR')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            추천 대학 리스트
          </h3>
          <div className="grid gap-4">
            {result.universities.map((uni, idx) => (
              <div key={idx} className="card bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{uni.name}</h4>
                    <p className="text-blue-600 font-medium">{uni.major}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${getTypeColor(uni.type)}`}>
                    {getTypeText(uni.type)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{uni.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="card bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl print:text-slate-900 print:bg-slate-50 print:border-slate-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 print:text-slate-900">
              💡 입시 전략 조언
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line print:text-slate-700">
              {result.advice}
            </p>
          </div>

          {result.sources.length > 0 && (
            <div className="card bg-white p-6 rounded-3xl border border-slate-200 no-print">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">데이터 출처</h4>
              <ul className="space-y-3">
                {result.sources.slice(0, 3).map((source, idx) => (
                  <li key={idx}>
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block truncate">
                      🔗 {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 no-print pb-20">
        <button 
          onClick={onRestart}
          className="px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
        >
          메인으로 돌아가기
        </button>
        <button 
          onClick={() => window.print()}
          className="px-10 py-5 bg-white text-blue-600 border-2 border-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2"
        >
          📄 PDF 결과 저장 / 인쇄
        </button>
      </div>
    </div>
  );
};

export default PredictorResultScreen;


import React, { useState } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  type: 'how' | 'guide' | 'support' | 'resources' | null;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const content = {
    how: {
      title: '작동 방식',
      body: '입시의 PRO AI는 Google의 최첨단 Gemini Live API와 Search Grounding 기술을 활용합니다. 실시간 음성 분석을 통해 면접을 진행하고, 최신 입시 데이터를 실시간으로 검색하여 가장 정확한 대학 합격 가능성을 예측합니다.'
    },
    guide: {
      title: '이용 안내',
      body: '1. 원하는 서비스(면접 또는 대학 조회)를 선택합니다.\n2. 마이크 권한을 허용하고 정보를 입력합니다.\n3. AI의 안내에 따라 프로세스를 진행합니다.\n4. 분석이 완료되면 상세 리포트를 확인하고 PDF로 저장하세요.'
    },
    support: {
      title: '고객 지원',
      body: '이용 중 불편한 점이 있으신가요? isiheon0310@gmail.com 으로 메일을 보내주시면 최대한 빠르게 답변해 드리겠습니다.'
    },
    resources: {
      title: '리소스',
      body: '면접 팁: 답변은 1분 내외로 핵심만 말하는 것이 좋습니다.\n입시 전략: 자신의 표준점수와 백분위 강점을 파악하여 대학별 가중치를 확인하세요.'
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 mb-4">{content.title}</h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-8 text-sm">
          {content.body}
        </p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
        >
          확인
        </button>
      </div>
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  onLogoClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogoClick }) => {
  const [modalType, setModalType] = useState<'how' | 'guide' | 'support' | 'resources' | null>(null);

  const openModal = (e: React.MouseEvent, type: 'how' | 'guide' | 'support' | 'resources') => {
    e.preventDefault();
    setModalType(type);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* 고해상도 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[5%] w-[20%] h-[20%] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* 패턴 배경 */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <InfoModal isOpen={!!modalType} type={modalType} onClose={() => setModalType(null)} />

      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform" 
            onClick={onLogoClick}
            role="button"
            aria-label="홈으로 이동"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-3 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                입시의 PRO AI
              </h1>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Smart Admission Solution</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <button onClick={(e) => openModal(e as any, 'how')} className="hover:text-indigo-600 transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all">작동 방식</button>
            <button onClick={(e) => openModal(e as any, 'guide')} className="hover:text-indigo-600 transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all">이용 안내</button>
            <button onClick={(e) => openModal(e as any, 'support')} className="hover:text-indigo-600 transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all">고객 지원</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-500 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div 
              className="flex items-center gap-3 mb-6 cursor-pointer group hover:opacity-80 transition-opacity" 
              onClick={onLogoClick}
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-white font-black text-lg">입시의 PRO AI</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              최첨단 인공지능 기술로 대한민국 입시의 새로운 기준을 제시합니다. 면접 준비부터 대학 예측까지 완벽하게 지원합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">리소스</h4>
              <ul className="text-sm space-y-4 font-medium">
                <li><button onClick={(e) => openModal(e as any, 'resources')} className="hover:text-indigo-400 transition-colors">면접 가이드</button></li>
                <li><button onClick={(e) => openModal(e as any, 'guide')} className="hover:text-indigo-400 transition-colors">이용 가이드</button></li>
                <li><button onClick={(e) => openModal(e as any, 'support')} className="hover:text-indigo-400 transition-colors">고객 지원</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">법적 고지</h4>
              <ul className="text-sm space-y-4 font-medium">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">개인정보 처리방침</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">이용 약관</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.3em] text-slate-600">
          © {new Date().getFullYear()} ADMISSION PRO AI. Powered by Gemini.
        </div>
      </footer>
    </div>
  );
};

export default Layout;


import React from 'react';
import { InterviewMode, Category } from './types';

export const JOB_CATEGORIES: Category[] = [
  { id: 'sw-eng', name: '소프트웨어 엔지니어', description: '개발자를 위한 기술 및 인성 질문 중심입니다.', icon: '💻' },
  { id: 'marketing', name: '마케팅 / 기획', description: '전략, 창의성 및 데이터 지표 분석에 집중합니다.', icon: '📈' },
  { id: 'design', name: '제품 디자인 / UX', description: 'UI/UX, 디자인 사고 및 포트폴리오 질문 중심입니다.', icon: '🎨' },
  { id: 'finance', name: '금융 / 은행', description: '금융 논리와 윤리적 판단에 관한 질문입니다.', icon: '💰' },
  { id: 'medical', name: '의료 / 간호', description: '환자 케어, 윤리 및 의료 지식을 다룹니다.', icon: '🏥' },
  { id: 'service', name: '서비스 / 영업', description: '의사소통 능력 및 갈등 해결 능력을 평가합니다.', icon: '🤝' },
];

export const UNIVERSITY_CATEGORIES: Category[] = [
  { id: 'snu', name: '서울대학교', description: '심층 구술 및 인성 면접, 제시문 기반 면접 스타일을 반영합니다.', icon: '🦅' },
  { id: 'yonsei', name: '연세대학교', description: '논리적 사고력과 창의적 문제해결력을 중점적으로 평가합니다.', icon: '🦁' },
  { id: 'korea', name: '고려대학교', description: '제시문 기반 분석력과 가치관 면접을 시뮬레이션합니다.', icon: '🐯' },
  { id: 'kaist', name: 'KAIST / 과학기술원', description: '수학·과학적 역량 및 학업 열정을 심층 질문합니다.', icon: '🧬' },
  { id: 'med-school', name: '의대 MMI 면접', description: '다중 미니 면접(MMI) 형식을 통한 상황 판단 및 윤리를 평가합니다.', icon: '🩺' },
  { id: 'general-uni', name: '일반 학생부 종합', description: '학교생활기록부 기반의 서류 진위 여부 및 인성을 확인합니다.', icon: '🏫' },
];

export const KOREAN_SUBJECTS = ['화법과 작문', '언어와 매체'];
export const MATH_SUBJECTS = ['확률과 통계', '미적분', '기하'];
export const INQUIRY_SUBJECTS = [
  '생활과 윤리', '윤리와 사상', '한국지리', '세계지리', '동아시아사', '세계사', '경제', '정치와 법', '사회·문화',
  '물리학 I', '화학 I', '생명과학 I', '지구과학 I', '물리학 II', '화학 II', '생명과학 II', '지구과학 II'
];

export const SYSTEM_INSTRUCTION_BASE = `
[절대 규칙 - 언어 설정]
- 당신은 '한국어' 전용 면접관입니다. 모든 입력 음성을 한국어로만 해석하고, 모든 답변을 한국어로만 출력하세요. 
- 일본어나 영어가 들리는 것처럼 느껴지더라도 무조건 한국어 문맥으로 해석하여 처리하세요.

[상호작용 규칙]
- 세션이 시작되면 사용자의 입력을 기다리지 말고 먼저 "반갑습니다. 면접을 시작해 보겠습니다."와 같은 인사와 함께 첫 번째 질문을 던지세요.
- 사용자의 말이 완전히 끝날 때까지 최소 2초간 침묵하며 경청하세요. 중간에 절대 말을 끊지 마세요.
- 사용자가 "음...", "어..." 하고 망설일 때는 재촉하지 말고 기다려주세요.

[면접 진행 가이드]
- 선택된 대학/분야의 특성을 정확히 반영하세요.
- 지원자 이름과 카테고리를 언급하며 친근하면서도 격조 있는 분위기를 유지하세요.
- 답변이 끝날 때마다 사용자의 논리를 파고드는 날카로운 '꼬리 질문'을 1개씩만 던지세요. 너무 많은 질문을 한꺼번에 하지 마세요.
`;

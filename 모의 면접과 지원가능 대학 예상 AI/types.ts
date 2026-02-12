
export enum InterviewMode {
  JOB = 'JOB',
  UNIVERSITY = 'UNIVERSITY'
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface InterviewConfig {
  mode: InterviewMode;
  category: Category;
  userName: string;
}

export interface FeedbackData {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  transcription: string;
}

export interface GradeData {
  koreanSubject: string;
  koreanStdScore: string;
  koreanPercentile: string;
  mathSubject: string;
  mathStdScore: string;
  mathPercentile: string;
  english: string;
  search1Subject: string;
  search1StdScore: string;
  search1Percentile: string;
  search2Subject: string;
  search2StdScore: string;
  search2Percentile: string;
  gpa?: string;
}

export interface AdmissionResult {
  universities: {
    name: string;
    major: string;
    type: 'SAFE' | 'TARGET' | 'REACH';
    reason: string;
  }[];
  advice: string;
  sources: { title: string; uri: string }[];
}

export enum AppStatus {
  HOME,
  PICK_CATEGORY,
  PREP,
  INTERVIEWING,
  RESULT,
  PREDICTOR_INPUT,
  PREDICTOR_RESULT
}

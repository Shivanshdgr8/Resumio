import axios from 'axios';
import { Resume } from '../schemas/resume';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SuggestRequest {
  task: 'bullet' | 'summary' | 'skills' | 'rewrite';
  sourceText: string;
  role?: string;
  level?: 'junior' | 'mid' | 'senior' | 'entry' | 'intern';
  jobDesc?: string;
  count?: number;
  resume_text?: string; // Added based on the instruction's implied change
  question_type?: 'technical' | 'behavioral' | 'mixed'; // Added based on the instruction's implied change
}

export interface SuggestResponse {
  suggestions: string[];
}

export interface InterviewQuestionsRequest {
  job_description: string;
  resume_text: string;
  question_type: 'technical' | 'behavioral' | 'mixed';
  count: number;
}

export interface InterviewQuestion {
  question: string;
  suggested_answer: string;
  category: 'technical' | 'behavioral';
  difficulty?: 'easy' | 'medium' | 'hard';
  context?: string;
}

export interface InterviewQuestionsResponse {
  technical_questions: InterviewQuestion[];
  behavioral_questions: InterviewQuestion[];
}

export interface ATSResponse {
  score: number;
  breakdown: {
    keywords: number;
    verbs: number;
    metrics: number;
    sections: number;
    experience: number;
    details: {
      keywords: {
        matched_count: number;
        total_keywords: number;
        missing_keywords: string[];
      };
      verbs: {
        count: number;
        recommended: number;
      };
      metrics: {
        count: number;
        recommended: number;
      };
      sections: Record<string, boolean>;
      experience: {
        count: number;
        has_descriptions: boolean;
        has_dates: boolean;
      };
    };
  };
  tips: string[];
}

export interface HealthResponse {
  status: string;
  env: string;
  db: boolean;
}

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await api.get('/api/health');
  return response.data;
};

export const suggest = async (data: SuggestRequest): Promise<SuggestResponse> => {
  const response = await api.post('/api/suggest/', data);
  return response.data;
};

export const generateInterviewQuestions = async (data: InterviewQuestionsRequest): Promise<InterviewQuestionsResponse> => {
  const response = await api.post('/api/interview/generate', data);
  return response.data;
};

export const generateInterviewQuestionsFromFile = async ({
  file,
  jobDesc,
  numTechQuestions,
  numBehavioralQuestions
}: {
  file: File;
  jobDesc?: string;
  numTechQuestions: number;
  numBehavioralQuestions: number;
}): Promise<InterviewQuestionsResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (jobDesc) formData.append('jobDesc', jobDesc);
  formData.append('numTechQuestions', numTechQuestions.toString());
  formData.append('numBehavioralQuestions', numBehavioralQuestions.toString());

  const response = await api.post('/api/interview/generate-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const atsScore = async (resume: Resume, jobDesc?: string): Promise<ATSResponse> => {
  const response = await api.post('/api/ats/score', { resume, jobDesc });
  return response.data;
};

export const atsScoreFromFile = async (file: File, jobDescription?: string): Promise<ATSResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (jobDescription) {
    formData.append('jobDesc', jobDescription);
  }

  const response = await api.post('/api/ats/score-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;

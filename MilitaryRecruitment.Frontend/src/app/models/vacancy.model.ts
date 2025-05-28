// Move Candidate interface here to avoid circular dependency
export interface CandidateBasic {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  score?: number;
}

export interface Application {
  id: string;
  candidateId: string;
  vacancyId: string;
  score: number;
  isChosenByAlgorithm: boolean;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  candidate?: CandidateBasic;
}

export interface Vacancy {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  department: string;
  location: string;
  unit: string;
  positionType: 'full-time' | 'part-time' | 'contract' | 'temporary';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    isPublic: boolean;
  };
  quota: number;
  availablePositions: number;
  startDate: Date;
  deadline: Date;
  isActive: boolean;
  isRemote: boolean;
  applications?: Application[];
  applicationCount?: number;
  tags: string[];
  skills: string[];
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface VacancyListResponse {
  data: Vacancy[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

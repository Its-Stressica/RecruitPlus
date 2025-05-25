// Define a basic Vacancy interface to avoid circular dependency
interface VacancyBasic {
  id: string;
  title: string;
  description: string;
  quota: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  score?: number;
  applications?: Application[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Application {
  id: string;
  candidateId: string;
  vacancyId: string;
  score: number;
  isChosenByAlgorithm: boolean;
  createdAt: Date;
  updatedAt: Date;
  vacancy?: VacancyBasic;
}

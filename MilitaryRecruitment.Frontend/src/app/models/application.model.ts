// Base application interface with common fields
export interface BaseApplication {
  id: string;
  candidateId: string;
  vacancyId: string;
  score: number;
  isChosenByAlgorithm: boolean;
  wasFullyCheckedByAlgorithm?: boolean;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
  appliedAt?: Date | string;
  reviewedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  vacancy?: any;
}

// Interface for getting application data (includes candidate names)
export interface Application extends BaseApplication {
  candidateFirstName: string;
  candidateLastName: string;
  candidate?: any; // Keeping this for backward compatibility
}

// Interface for creating a new application
export interface CreateApplicationDto extends Omit<BaseApplication, 'id' | 'createdAt' | 'updatedAt' | 'wasFullyCheckedByAlgorithm'> {
  // No additional fields needed, just using Omit to exclude unnecessary fields
}

// Interface for updating an application
export interface UpdateApplicationDto extends Partial<Omit<BaseApplication, 'id' | 'candidateId' | 'vacancyId' | 'createdAt' | 'updatedAt'>> {
  // Only include fields that can be updated
}

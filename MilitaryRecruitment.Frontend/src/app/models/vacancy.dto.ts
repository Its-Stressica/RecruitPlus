export interface VacancyCreateDto {
  title: string;
  description: string;
  quota: number;
}

export interface VacancyGetDto {
  id: string;
  title: string;
  description: string;
  quota: number;
  createdAt: string;
  updatedAt: string;
}

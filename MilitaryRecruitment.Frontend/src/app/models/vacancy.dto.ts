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
  applicationCount: number;
  chosenApplicationsCount: number;
  hasBeenChecked: boolean;
  createdAt: string;
  updatedAt: string;
}

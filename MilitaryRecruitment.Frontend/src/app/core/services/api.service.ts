import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';

import { environment } from '../../../environments/environment';
import { Vacancy, VacancyListResponse } from '../../models/vacancy.model';
import { Candidate, Application } from '../../models/candidate.model';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  private useMockData = true; // Set to false when real API is available

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  /**
   * Build URL parameters from an object
   */
  private buildParams(params: PaginationParams): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, item.toString());
          });
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });
    
    return httpParams;
  }

  // ===== Vacancy Endpoints =====
  getVacancies(params: PaginationParams = { page: 1, pageSize: 10 }): Observable<VacancyListResponse> {
    if (this.useMockData) {
      return this.mockDataService.getVacancies(params.page || 1, params.pageSize || 10);
    }
    
    const httpParams = this.buildParams(params);
    return this.http.get<VacancyListResponse>(`${this.apiUrl}/vacancies`, { params: httpParams });
  }

  getVacancy(id: string): Observable<Vacancy> {
    if (this.useMockData) {
      return this.mockDataService.getVacancyById(id) as Observable<Vacancy>;
    }
    
    return this.http.get<Vacancy>(`${this.apiUrl}/vacancies/${id}`);
  }

  getActiveVacancies(params: PaginationParams = {}): Observable<VacancyListResponse> {
    if (this.useMockData) {
      return this.getVacancies({ ...params, isActive: true });
    }
    
    const defaultParams = { isActive: true, ...params };
    return this.getVacancies(defaultParams);
  }

  // ===== Candidate Endpoints =====
  getCandidates(params?: PaginationParams): Observable<{ data: Candidate[]; total: number }> {
    if (this.useMockData) {
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      return this.mockDataService.getCandidates(page, pageSize);
    }
    
    const httpParams = params ? this.buildParams(params) : undefined;
    return this.http.get<{ data: Candidate[]; total: number }>(`${this.apiUrl}/candidates`, { params: httpParams });
  }

  getCandidate(id: string): Observable<Candidate> {
    if (this.useMockData) {
      return this.mockDataService.getCandidateById(id) as Observable<Candidate>;
    }
    
    return this.http.get<Candidate>(`${this.apiUrl}/candidates/${id}`);
  }

  getCandidateApplications(candidateId: string): Observable<Application[]> {
    if (this.useMockData) {
      return this.mockDataService.getCandidateApplications(candidateId);
    }
    
    return this.http.get<Application[]>(`${this.apiUrl}/candidates/${candidateId}/applications`);
  }
}

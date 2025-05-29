import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../src/environments/environment';
import { Application } from '../../models/vacancy.model';
import { VacancyGetDto, VacancyCreateDto } from '../../models/vacancy.dto';

// Re-export DTOs for easier imports in other files
export type { VacancyGetDto, VacancyCreateDto } from '../../models/vacancy.dto';

// Simple filter interface for future use
export interface FilterParams {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || 'http://localhost:5000/api';
  private readonly useMockData = !environment.production; // Use mock data in development

  /**
   * Build URL parameters from an object
   */
  private buildParams(params: FilterParams = {}): HttpParams {
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
  
  /**
   * Get all vacancies
   */
  getVacancies(): Observable<VacancyGetDto[]> {
    return this.http.get<VacancyGetDto[]>(`${this.apiUrl}/vacancies`);
  }

  /**
   * Get a single vacancy by ID
   */
  getVacancyById(id: string): Observable<VacancyGetDto> {    
    return this.http.get<VacancyGetDto>(`${this.apiUrl}/vacancies/${id}`);
  }

  /**
   * Get active vacancies
   */
  getActiveVacancies(): Observable<VacancyGetDto[]> {
    // Client-side filtering for active vacancies
    return this.getVacancies().pipe(
      map(vacancies => vacancies.filter(vacancy => {
        // For now, we'll consider all vacancies from the API as active
        // If the API starts supporting isActive, we can uncomment this:
        // return vacancy.isActive;
        return true;
      }))
    );
  }

  /**
   * Create a new vacancy
   */
  createVacancy(vacancy: VacancyCreateDto): Observable<VacancyGetDto> {
    if (this.useMockData) {
      // In a real app, you might want to implement mock data similar to ApiService
      throw new Error('Mock data not implemented for VacancyService');
    }
    
    return this.http.post<VacancyGetDto>(`${this.apiUrl}/vacancies`, vacancy);
  }

  /**
   * Update an existing vacancy
   */
  updateVacancy(id: string, vacancy: Partial<VacancyCreateDto>): Observable<VacancyGetDto> {
    if (this.useMockData) {
      // In a real app, you might want to implement mock data similar to ApiService
      throw new Error('Mock data not implemented for VacancyService');
    }
    
    return this.http.patch<VacancyGetDto>(`${this.apiUrl}/vacancies/${id}`, vacancy);
  }

  /**
   * Delete a vacancy
   */
  deleteVacancy(id: string): Observable<void> {
    if (this.useMockData) {
      // In a real app, you might want to implement mock data similar to ApiService
      throw new Error('Mock data not implemented for VacancyService');
    }
    
    return this.http.delete<void>(`${this.apiUrl}/vacancies/${id}`);
  }

  /**
   * Get applications for a specific vacancy
   * @param vacancyId ID of the vacancy
   */
  getVacancyApplications(vacancyId: string): Observable<Application[]> {
    if (this.useMockData) {
      // In a real app, you might want to implement mock data
      return of([]);
    }
    
    return this.http.get<Application[]>(`${this.apiUrl}/vacancies/${vacancyId}/applications`);
  }

  /**
   * Update application status
   * @param applicationId ID of the application
   * @param status New status for the application
   */
  updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected' | 'pending'): Observable<void> {
    if (this.useMockData) {
      // In a real app, you might want to implement mock data
      return of(undefined);
    }
    
    return this.http.patch<void>(
      `${this.apiUrl}/applications/${applicationId}/status`,
      { status }
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../src/environments/environment';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '../../models/application.model';

export interface ApplicationFilterParams {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || 'http://localhost:5000/api';

  private buildParams(params: ApplicationFilterParams = {}): HttpParams {
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

  private mapApplication(app: Application): Application {
    return {
      ...app,
      wasFullyCheckedByAlgorithm: !!app.wasFullyCheckedByAlgorithm,
      isChosenByAlgorithm: !!app.isChosenByAlgorithm,
      appliedAt: app.appliedAt ? new Date(app.appliedAt) : undefined,
      createdAt: new Date(app.createdAt),
      updatedAt: new Date(app.updatedAt)
    };
  }

  getApplications(params?: ApplicationFilterParams): Observable<Application[]> {
    const url = params?.['vacancyId'] 
      ? `${this.apiUrl}/applications/vacancy/${params['vacancyId']}`
      : `${this.apiUrl}/applications`;
    
    const options = params?.['vacancyId'] 
      ? {}
      : { params: params ? this.buildParams(params) : new HttpParams() };
    
    return this.http.get<Application[]>(url, options).pipe(
      map(applications => applications.map(app => this.mapApplication(app)))
    );
  }

  getApplicationById(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/applications/${id}`);
  }

  createApplication(application: CreateApplicationDto): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/applications`, application);
  }

  updateApplication(id: string, updates: UpdateApplicationDto): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/applications/${id}`, updates);
  }

  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/applications/${id}`);
  }

  /**
   * Resets assignment status for all applications
   * Sets isChosenByAlgorithm and wasFullyCheckedByAlgorithm to false
   * @returns Observable that completes when the operation is done
   */
  resetAssignments(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/applications/reset-assignments`, {});
  }

  /**
   * Runs the assignment Algorithm to assign candidates to vacancies
   * @returns Observable that completes when the Algorithm has finished
   */
  runAssignmentAlgorithm(): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/applications/run-Algorithm`, {});
  }

  /**
   * Get vacancy details including quota
   * @param id Vacancy ID
   * @returns Vacancy details with quota
   */
  getVacancyDetails(id: string): Observable<{id: string, title: string, quota: number}> {
    return this.http.get<{id: string, title: string, quota: number}>(`${this.apiUrl}/vacancies/${id}`);
  }
}

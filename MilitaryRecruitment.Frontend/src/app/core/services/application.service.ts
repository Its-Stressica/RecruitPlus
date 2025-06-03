import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getApplications(params?: ApplicationFilterParams): Observable<Application[]> {
    // If we have a vacancyId, use the specific endpoint for better performance
    if (params && 'vacancyId' in params && params['vacancyId']) {
      return this.http.get<Application[]>(`${this.apiUrl}/applications/vacancy/${params['vacancyId']}`);
    }
    
    // Otherwise, fall back to the general endpoint with filters
    return this.http.get<Application[]>(`${this.apiUrl}/applications`, { 
      params: params ? this.buildParams(params) : undefined 
    });
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

  resetAssignments(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/applications/reset-assignments`, {});
  }
}

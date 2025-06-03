import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';
import { Candidate } from '../../models/candidate.model';
import { Application } from '../../models/application.model';

export interface CandidateFilterParams {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || 'http://localhost:5000/api';

  private buildParams(params: CandidateFilterParams = {}): HttpParams {
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

  getCandidates(params?: CandidateFilterParams): Observable<{ data: Candidate[]; total: number }> {
    return this.http.get<{ data: Candidate[]; total: number }>(`${this.apiUrl}/candidates`, { params: params ? this.buildParams(params) : undefined });
  }

  getCandidate(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/candidates/${id}`);
  }

  getCandidateApplications(candidateId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/candidates/${candidateId}/applications`);
  }

  // Test method to verify API connectivity
  testApiConnection(): Observable<any> {
    console.log('Testing API connection to:', this.apiUrl);
    return this.http.get(`${this.apiUrl}/candidates`);
  }
}

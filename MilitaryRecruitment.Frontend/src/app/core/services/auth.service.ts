import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {}

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login(credentials: { username: string; password: string }): Observable<boolean> {
    // In a real app, you would make an HTTP request to your backend
    // This is a mock implementation
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      localStorage.setItem(this.TOKEN_KEY, 'dummy-jwt-token');
      this.isAuthenticatedSubject.next(true);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}

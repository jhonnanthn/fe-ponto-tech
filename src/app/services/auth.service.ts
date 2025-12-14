import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/v1/auth';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
  }

  getToken(): string | null {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem('auth.token') : null;
    } catch (e) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    try {
      localStorage.removeItem('auth.token');
      localStorage.removeItem('auth.user');
    } catch (e) {
      console.warn('Failed to clear localStorage on logout', e);
    }
  }
}

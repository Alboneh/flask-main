import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  private apiUrl = 'http://localhost:3030';
  private isAuthenticatedSubject: Subject<boolean> = new Subject<boolean>();

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 

    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }

  login(name: string, password: string): Observable<any> {
    const body = { name, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  handleLoginResponse(response: any): void {
    const { access_token } = response;
    localStorage.setItem('access_token', access_token);
    this.isAuthenticatedSubject.next(true); // Notify that the user is authenticated
    this.router.navigate(['/dashboard']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.isAuthenticatedSubject.next(false); // Notify that the user is not authenticated
    this.router.navigate(['/login']);
  }
}

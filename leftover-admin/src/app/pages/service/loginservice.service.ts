import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  private apiUrl = 'http://localhost:3030';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(name: string, password: string): Observable<any> {
    const body = { name, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  handleLoginResponse(response: any): void {
    const { access_token } = response;
    localStorage.setItem('access_token', access_token);
    this.router.navigate(['/dashboard']);
  }

  isAuthenticated(): boolean {
    console.log(localStorage.getItem('access_token'))
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}

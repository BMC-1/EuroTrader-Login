import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5023/Account';

  constructor(private http: HttpClient) {}

  login(userDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, userDto);
  }

  register(userDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, userDto);
  }
}

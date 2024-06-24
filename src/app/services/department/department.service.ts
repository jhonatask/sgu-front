import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../../types/departament.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDepartaments(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/department`);
  }
}

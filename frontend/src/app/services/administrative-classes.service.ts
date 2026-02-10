import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdministrativeClassDTO {
  id: number;
  classCode: string;
  academicYear?: string;
  majorId?: number;
  majorName?: string;
  advisorId?: number;
  advisorName?: string;
  advisorEmail?: string;
  size?: number;
  avgGpa?: number;
  status?: 'ACTIVE' | 'LOCKED';
}

@Injectable({ providedIn: 'root' })
export class AdministrativeClassesService {
  private apiUrl = '/api/administrative-classes';

  constructor(private http: HttpClient) { }

  getAdministrativeClasses(params: { majorId?: number; academicYear?: string; status?: string; search?: string } = {}): Observable<AdministrativeClassDTO[]> {
    let httpParams = new HttpParams();
    if (params.majorId != null) httpParams = httpParams.set('majorId', String(params.majorId));
    if (params.academicYear) httpParams = httpParams.set('academicYear', params.academicYear);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<AdministrativeClassDTO[]>(this.apiUrl, { params: httpParams });
  }
}

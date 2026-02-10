import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubjectDTO {
  id: number;
  subjectCode: string;
  name: string;
  credits: number;
  blockCode: string;
  blockName: string;
  majorCodes: string[];
  prerequisiteCodes: string[];
  isRequired: boolean;
  recommendedSemester: number;
}

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private apiUrl = '/api/subjects';

  constructor(private http: HttpClient) {}

  getSubjects(blockId?: number, majorId?: number, search?: string): Observable<SubjectDTO[]> {
    let params = new HttpParams();
    if (blockId) params = params.set('blockId', blockId.toString());
    if (majorId) params = params.set('majorId', majorId.toString());
    if (search) params = params.set('search', search);
    return this.http.get<SubjectDTO[]>(this.apiUrl, { params });
  }

  createSubject(subject: Partial<SubjectDTO>): Observable<any> {
    return this.http.post(this.apiUrl, subject);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentProfileDTO {
  userId: number;
  studentCode: string;
  fullName: string;
  email: string;
  classId?: number;
  classCode?: string;
  enrollmentYear?: number;
  gpa?: number;
  accumulatedCredits?: number;
  academicStatus?: string;
}

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class StudentProfilesService {
  private apiUrl = '/api/student-profiles';

  constructor(private http: HttpClient) { }

  getStudentProfiles(params: {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    majorId?: number;
    classId?: number;
    academicStatus?: string;
    enrollmentYear?: number;
  } = {}): Observable<PagedResult<StudentProfileDTO>> {
    let httpParams = new HttpParams();
    if (params.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params.size != null) httpParams = httpParams.set('size', String(params.size));
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.majorId) httpParams = httpParams.set('majorId', String(params.majorId));
    if (params.classId) httpParams = httpParams.set('classId', String(params.classId));
    if (params.academicStatus) httpParams = httpParams.set('academicStatus', params.academicStatus);
    if (params.enrollmentYear) httpParams = httpParams.set('enrollmentYear', String(params.enrollmentYear));

    return this.http.get<PagedResult<StudentProfileDTO>>(this.apiUrl, { params: httpParams });
  }
}

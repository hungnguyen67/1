import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LecturerProfileDTO {
  userId: number;
  lecturerCode: string;
  fullName?: string;
  email?: string;
  majorId?: number;
  degree?: string;
  academicRank?: string;
}

@Injectable({ providedIn: 'root' })
export class LecturerProfilesService {
  private apiUrl = '/api/lecturer-profiles';

  constructor(private http: HttpClient) { }

  getLecturerProfiles(params: { majorId?: number; search?: string } = {}): Observable<LecturerProfileDTO[]> {
    let httpParams = new HttpParams();
    if (params.majorId != null) httpParams = httpParams.set('majorId', String(params.majorId));
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<LecturerProfileDTO[]>(this.apiUrl, { params: httpParams });
  }
}

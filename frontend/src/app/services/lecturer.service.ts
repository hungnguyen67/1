import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LecturerDTO {
    id: number;
    lecturerCode: string;
    fullName: string;
    majorName: string;
    majorId: number;
    degree: string;
    academicRank: string;
    phone: string;
    gender: string;
    advisorClasses: string[];
}

@Injectable({
    providedIn: 'root'
})
export class LecturerService {
    private apiUrl = '/api/lecturers';

    constructor(private http: HttpClient) { }

    getLecturers(searchTerm?: string, majorId?: number): Observable<LecturerDTO[]> {
        let params = new HttpParams();
        if (searchTerm) {
            params = params.set('searchTerm', searchTerm);
        }
        if (majorId) {
            params = params.set('majorId', majorId.toString());
        }
        return this.http.get<LecturerDTO[]>(this.apiUrl, { params });
    }
}

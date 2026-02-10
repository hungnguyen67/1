import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Semester {
    id: number;
    name: string;
    academicYear: string;
    semesterOrder: number;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    status: 'UPCOMING' | 'ONGOING' | 'FINISHED';
}

export interface PagedResult<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

@Injectable({
    providedIn: 'root'
})
export class SemesterService {

    private apiUrl = 'http://localhost:8001/api/semesters';

    constructor(private http: HttpClient) { }

    getSemesters(params: any): Observable<PagedResult<Semester>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.append(key, params[key]);
                }
            });
        }
        return this.http.get<PagedResult<Semester>>(this.apiUrl, { params: httpParams });
    }
}

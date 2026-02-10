import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubjectStatsDTO {
    id: number;
    subjectCode: string;
    name: string;
    credits: number;
    totalClasses: number;
    totalStudents: number;
}

export interface CourseClassDTO {
    id: number;
    classCode: string;
    subjectId: number;
    subjectName: string;
    lecturerName: string;
    semesterName: string;
    majorName: string;
    registrationStart: string;
    registrationEnd: string;
    currentEnrolled: number;
    maxStudents: number;
    status: string;
    lecturerId?: number;
    semesterId?: number;
    groupName?: string;
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
export class SectionService {

    private apiUrl = 'http://localhost:8001/api/sections';

    constructor(private http: HttpClient) { }

    getSubjects(params: any): Observable<PagedResult<SubjectStatsDTO>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.append(key, params[key]);
                }
            });
        }
        return this.http.get<PagedResult<SubjectStatsDTO>>(`${this.apiUrl}/subjects`, { params: httpParams });
    }

    getClassesBySubject(subjectId: number): Observable<CourseClassDTO[]> {
        return this.http.get<CourseClassDTO[]>(`${this.apiUrl}/by-subject/${subjectId}`);
    }

    getClassesBySemester(semesterId: number): Observable<CourseClassDTO[]> {
        return this.http.get<CourseClassDTO[]>(`${this.apiUrl}/by-semester/${semesterId}`);
    }

    createClasses(classes: any[]): Observable<any> {
        return this.http.post(this.apiUrl, classes);
    }
}

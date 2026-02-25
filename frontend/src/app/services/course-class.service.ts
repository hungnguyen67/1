import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseSubjectGroup {
    subjectId: number;
    subjectCode: string;
    subjectName: string;
    credits: number;
    classCount: number;
    status: string;
}

export interface CourseClass {
    id: number;
    classCode: string;
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    credits: number;
    lecturerName: string;
    maxStudents: number;
    currentEnrolled: number;
    classStatus: string;
    schedules: ClassSchedule[];
}

export interface ClassSchedule {
    dayOfWeek: number;
    startPeriod: number;
    endPeriod: number;
    roomName: string;
    sessionType: string;
}

@Injectable({
    providedIn: 'root'
})
export class CourseClassService {
    private apiUrl = 'http://localhost:8001/api/course-classes';

    constructor(private http: HttpClient) { }

    getGroupedSubjects(semesterId: number): Observable<CourseSubjectGroup[]> {
        return this.http.get<CourseSubjectGroup[]>(`${this.apiUrl}/subjects?semesterId=${semesterId}`);
    }

    getClassesBySemester(semesterId: number): Observable<CourseClass[]> {
        return this.http.get<CourseClass[]>(`${this.apiUrl}?semesterId=${semesterId}`);
    }

    getClassDetails(semesterId: number, subjectId: number): Observable<CourseClass[]> {
        return this.http.get<CourseClass[]>(`${this.apiUrl}/details?semesterId=${semesterId}&subjectId=${subjectId}`);
    }

    createCourseClass(semesterId: number, courseClass: any): Observable<CourseClass> {
        return this.http.post<CourseClass>(`${this.apiUrl}?semesterId=${semesterId}`, courseClass);
    }

    updateCourseClass(id: number, courseClass: any): Observable<CourseClass> {
        return this.http.put<CourseClass>(`${this.apiUrl}/${id}`, courseClass);
    }

    deleteCourseClass(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getDemandAnalysis(semesterId: number, cohort?: number): Observable<any[]> {
        const url = cohort
            ? `${this.apiUrl}/analysis?semesterId=${semesterId}&cohort=${cohort}`
            : `${this.apiUrl}/analysis?semesterId=${semesterId}`;
        return this.http.get<any[]>(url);
    }
}

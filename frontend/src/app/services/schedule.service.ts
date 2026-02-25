import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConflictInfo {
    type: string;
    content: string;
}

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = 'http://localhost:8001/api/schedules';

    constructor(private http: HttpClient) { }

    generateInstances(classId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/generate/${classId}`, {});
    }

    addPattern(classId: number, pattern: any): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/patterns/${classId}`, pattern);
    }

    getScheduleByCourseClass(classId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/class/${classId}`);
    }

    getConflicts(classId: number): Observable<ConflictInfo[]> {
        return this.http.get<ConflictInfo[]>(`${this.apiUrl}/conflicts/${classId}`);
    }
}

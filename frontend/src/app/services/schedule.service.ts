import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = 'http://localhost:8001/api/schedule';
    private managementUrl = 'http://localhost:8001/api/schedule-management';

    constructor(private http: HttpClient, private auth: AuthService) { }

    getMySchedule(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my`, this.auth.getAuthHeaders());
    }

    getScheduleByCourseClass(courseClassId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/course-class/${courseClassId}`, this.auth.getAuthHeaders());
    }

    createPattern(pattern: any): Observable<any> {
        return this.http.post<any>(`${this.managementUrl}/patterns`, pattern, this.auth.getAuthHeaders());
    }

    generateInstances(courseClassId: number): Observable<any> {
        return this.http.post<any>(`${this.managementUrl}/generate/${courseClassId}`, {}, this.auth.getAuthHeaders());
    }

    getConflicts(courseClassId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.managementUrl}/conflicts/${courseClassId}`, this.auth.getAuthHeaders());
    }
}

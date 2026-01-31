import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = 'http://localhost:8001/api/schedule';

    constructor(private http: HttpClient, private auth: AuthService) { }

    getMySchedule(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my`, this.auth.getAuthHeaders());
    }
}

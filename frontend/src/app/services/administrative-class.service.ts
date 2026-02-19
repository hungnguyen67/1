import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdministrativeClassDTO {
    id: number;
    classCode: string;
    majorId: number;
    majorName: string;
    academicYear: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdministrativeClassService {
    private apiUrl = '/api/classes';

    constructor(private http: HttpClient) { }

    getClasses(): Observable<AdministrativeClassDTO[]> {
        return this.http.get<AdministrativeClassDTO[]>(this.apiUrl);
    }
}

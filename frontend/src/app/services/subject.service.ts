import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubjectDTO {
    id: number;
    subjectCode: string;
    name: string;
    credits: number;
}

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private apiUrl = 'http://localhost:8001/api/subjects';

    constructor(private http: HttpClient) { }

    getAllSubjects(): Observable<SubjectDTO[]> {
        return this.http.get<SubjectDTO[]>(this.apiUrl);
    }
}

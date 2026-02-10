import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface KnowledgeBlockDTO {
  id: number;
  blockCode: string;
  blockName: string;
  totalCreditsRequired: number;
  mandatoryCreditsMin: number;
  subjectCount: number;
  percentMandatory: number;
  majorId: number;
}

@Injectable({ providedIn: 'root' })
export class KnowledgeBlockService {
  private apiUrl = '/api/knowledge-blocks';

  constructor(private http: HttpClient) {}

  getKnowledgeBlocksByMajor(majorId: number): Observable<KnowledgeBlockDTO[]> {
    return this.http.get<KnowledgeBlockDTO[]>(`${this.apiUrl}/major/${majorId}`);
  }

  createKnowledgeBlock(majorId: number, block: Partial<KnowledgeBlockDTO>): Observable<any> {
    return this.http.post(`${this.apiUrl}/major/${majorId}`, block);
  }

  getAllKnowledgeBlocks(): Observable<KnowledgeBlockDTO[]> {
    return this.http.get<KnowledgeBlockDTO[]>(`${this.apiUrl}/all`);
  }
}

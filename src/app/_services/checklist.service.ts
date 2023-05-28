import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { Checklist } from '../_models/checklist';

const baseUrl = `${environment.serverUrl}/checklists`;

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }


  getChecklistById(checklistId: string): Observable<Checklist> {
    return this.http.get<Checklist>(`${baseUrl}/${checklistId}`);
  }

}
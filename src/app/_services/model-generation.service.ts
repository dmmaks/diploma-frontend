import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { GeneratedModel } from '../_models/generated-model';

const baseUrl = `${environment.serverUrl}/modelGeneration`;

@Injectable({
  providedIn: 'root'
})
export class ModelGenerationService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }


  generateModelById(deviceId: string): Observable<GeneratedModel> {
    return this.http.get<GeneratedModel>(`${baseUrl}/generate/${deviceId}`);
  }

}

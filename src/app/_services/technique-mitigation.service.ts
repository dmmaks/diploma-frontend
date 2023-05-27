import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { GeneratedModel } from '../_models/generated-model';
import { TechniqueMitigation } from '../_models/technique-mitigation';

const baseUrl = `${environment.serverUrl}/techniquesMitigations`;

@Injectable({
  providedIn: 'root'
})
export class TechniqueMitigationService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }


  getTechniqueById(techniqueId: string): Observable<TechniqueMitigation> {
    return this.http.get<TechniqueMitigation>(`${baseUrl}/techniques/${techniqueId}`);
  }

  getMitigationById(mitigationIs: string): Observable<TechniqueMitigation> {
    return this.http.get<TechniqueMitigation>(`${baseUrl}/mitigations/${mitigationIs}`);
  }

}

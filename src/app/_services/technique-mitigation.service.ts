import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { TechniqueMitigation } from '../_models/technique-mitigation';
import { StandardSearchParams } from '../_models/standard-search-params';
import { Page } from '../_models';
import { TechniqueMitigationWithLinks } from '../_models/technique-mitigation-with-links';

const baseUrl = `${environment.serverUrl}/techniquesMitigations`;

@Injectable({
  providedIn: 'root'
})
export class TechniqueMitigationService {
  searchParams: StandardSearchParams;

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

  getTechniqueWithLinksById(techniqueId: string): Observable<TechniqueMitigationWithLinks> {
    return this.http.get<TechniqueMitigationWithLinks>(`${baseUrl}/techniques/withLinks/${techniqueId}`);
  }

  getMitigationWithLinksById(mitigationIs: string): Observable<TechniqueMitigationWithLinks> {
    return this.http.get<TechniqueMitigationWithLinks>(`${baseUrl}/mitigations/withLinks/${mitigationIs}`);
  }

  getTechniqueList(currentPage: number, searchedParams: StandardSearchParams, pageSize: number): Observable<Page<TechniqueMitigation>> {
    return this.http.get<Page<TechniqueMitigation>>(`${baseUrl}/techniques`, {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', searchedParams.name)
          .set('order', searchedParams.order == 'asc')});
  }

  getTechniquesBySearch(searchParams: StandardSearchParams, pageSize: number): Observable<Page<TechniqueMitigation>> {
    this.searchParams = searchParams;
    return this.getTechniqueList(0, this.searchParams, pageSize);
  }

  getTechniquesByPageNum(currentPage: number, pageSize: number): Observable<Page<TechniqueMitigation>> {
    return this.getTechniqueList(currentPage, this.searchParams, pageSize);
  }

  deleteTechnique(id: string) : Observable<Object> {
    return this.http.delete(`${baseUrl}/techniques/${id}`);
  }

}

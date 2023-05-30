import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { TechniqueMitigation } from '../_models/technique-mitigation';
import { StandardSearchParams } from '../_models/standard-search-params';
import { Page } from '../_models';
import { TechniqueMitigationWithLinks } from '../_models/technique-mitigation-with-links';
import { Applicability } from '../_models/applicability';
import { TechniqueApplicabilityWithLinks } from '../_models/technique-applicability-with-links';

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

  getMitigationWithLinksById(mitigationId: string): Observable<TechniqueMitigationWithLinks> {
    return this.http.get<TechniqueMitigationWithLinks>(`${baseUrl}/mitigations/withLinks/${mitigationId}`);
  }

  getApplicabilityByTechniqueId(techniqueId: string): Observable<Applicability> {
    return this.http.get<Applicability>(`${baseUrl}/techniques/applicability/${techniqueId}`);
  }

  getTechniqueList(currentPage: number, searchedParams: StandardSearchParams, pageSize: number): Observable<Page<TechniqueMitigation>> {
    return this.http.get<Page<TechniqueMitigation>>(`${baseUrl}/techniques`, {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', searchedParams.name)
          .set('order', searchedParams.order == 'asc')});
  }

  getMitigationList(currentPage: number, searchedParams: StandardSearchParams, pageSize: number): Observable<Page<TechniqueMitigation>> {
    return this.http.get<Page<TechniqueMitigation>>(`${baseUrl}/mitigations`, {
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

  createTechnique(dto: TechniqueApplicabilityWithLinks): Observable<Object> {
    return this.http.post(`${baseUrl}/techniques`, dto);
  }

  editTechnique(dto: TechniqueApplicabilityWithLinks): Observable<Object>{
    return this.http.put(`${baseUrl}/techniques/${dto.techniqueWithLinks.id}`, dto);
  }

  getMitigationsBySearch(searchParams: StandardSearchParams, pageSize: number): Observable<Page<TechniqueMitigation>> {
    this.searchParams = searchParams;
    return this.getMitigationList(0, this.searchParams, pageSize);
  }

  getMitigationsByPageNum(currentPage: number, pageSize: number): Observable<Page<TechniqueMitigation>> {
    return this.getMitigationList(currentPage, this.searchParams, pageSize);
  }

  deleteMitigation(id: string) : Observable<Object> {
    return this.http.delete(`${baseUrl}/mitigations/${id}`);
  }

  createMitigation(dto: TechniqueMitigationWithLinks): Observable<Object> {
    return this.http.post(`${baseUrl}/mitigations`, dto);
  }

  editMitigation(dto: TechniqueMitigationWithLinks): Observable<Object>{
    return this.http.put(`${baseUrl}/mitigations/${dto.id}`, dto);
  }

}

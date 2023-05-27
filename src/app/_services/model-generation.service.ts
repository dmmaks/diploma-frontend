import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../_models/page";
import {ActivatedRoute, Router} from "@angular/router";
import { SearchDeviceParams } from '../_models/search-device-params';
import { Device } from '../_models/device';
import { GeneratedModel } from '../_models/generated-model';

const baseUrl = `${environment.serverUrl}/modelGeneration`;

@Injectable({
  providedIn: 'root'
})
export class ModelGenerationService {
  deviceId: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }


  generatModelById(deviceId: string): Observable<GeneratedModel> {
    return this.http.get<GeneratedModel>(`${baseUrl}/generate/${deviceId}`);
  }

}

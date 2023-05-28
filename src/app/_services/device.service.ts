import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../_models/page";
import {ActivatedRoute, Router} from "@angular/router";
import { SearchDeviceParams } from '../_models/search-device-params';
import { Device } from '../_models/device';

const baseUrl = `${environment.serverUrl}/devices`;

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  searchParams: SearchDeviceParams;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }


  getDeviceList(currentPage: number, searchedParams: SearchDeviceParams, pageSize: number): Observable<Page<Device>> {
    return this.http.get<Page<Device>>(`${baseUrl}?`, {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', searchedParams.name)
          .set('order', searchedParams.order == 'asc')});
  }

  getDevicesBySearch(searchParams: SearchDeviceParams, pageSize: number): Observable<Page<Device>> {
    this.searchParams = searchParams;
    return this.getDeviceList(0, this.searchParams, pageSize);
  }

  getDevicesByPageNum(currentPage: number, pageSize: number): Observable<Page<Device>> {
    return this.getDeviceList(currentPage, this.searchParams, pageSize);
  }

  deleteDevice(id: string) : Observable<Object> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  editDevice(device: Device): Observable<Object>{
    return this.http.put(`${baseUrl}/${device.id}`, device);
  }

  createDevice(device: Device): Observable<Object> {
    return this.http.post(`${baseUrl}`, device);
  }
}

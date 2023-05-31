import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Observable, ReplaySubject} from "rxjs";
import {AlertService, AuthService} from "../../_services";
import {Page} from "../../_models/page";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Sort, SortDirection } from '@angular/material/sort';
import { DeviceService } from 'src/app/_services/device.service';
import { DeletionConfirmationComponent } from '../deletion-confirmation/deletion-confirmation.component';
import { Device } from 'src/app/_models/device';
import { StandardSearchParams } from 'src/app/_models/standard-search-params';
import { DeviceCreationComponent } from '../device-creation/device-creation.component';
import { DeviceEditComponent } from '../device-edit/device-edit.component';


@Component({
  selector: 'device-list-page',
  templateUrl: './device-list-page.component.html',
  styleUrls: ['./device-list-page.component.scss']
})
export class DeviceListPageComponent {
  pageContent: Page<Device>;
  searchForm: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['name', 'os', 'os_min_version', 'os_max_version', 'chipset', 'fingerprint_scanner', 'face_recognition', 'actions'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  userRole?: string;
  sortOrder: SortDirection = 'asc';

  constructor(
    private deviceService: DeviceService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
  }
  

  ngOnInit(): void {
    this.searchForm = this.createFormGroup();
    this.getDevicesBySearch();
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['']
    });
  }


  getDevicesBySearch(): void {
    const filter: StandardSearchParams = this.searchForm.value;
    filter.order = this.sortOrder;
    this.deviceService.getDevicesBySearch(this.searchForm.value, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = 0;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }

  getDevicePage(pageIndex: number, pageSize: number): void {
    this.deviceService.getDevicesByPageNum(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          if (response.content.length === 0) {
            this.getDevicePage(pageIndex - 1, pageSize);
          }
          this.pageContent = response;
          this.currentPage = pageIndex;
          this.pageSize = pageSize;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }

  confirmDeletion(id: string): void {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deviceService.deleteDevice(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("Пристрій видалено",true,true);
          this.getDevicePage(this.currentPage, this.pageSize);
        },
        error: error => {
          this.displayError(error);
        }
      });
      }
    });
  }

  sortData(sortOrder: string) : void {
    sortOrder === 'desc' ? this.sortOrder = 'desc' : this.sortOrder = 'asc';
    this.getDevicesBySearch();
  }


  paginationHandler(pageEvent: PageEvent): void {
      this.getDevicePage(pageEvent.pageIndex, pageEvent.pageSize);
  }

  createDevice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DeviceCreationComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getDevicePage(this.currentPage, this.pageSize);
    })
  }

  editDevice(device: Device){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, device);
    dialogConfig.data = {
      device: dataDialog
    };
    const dialogRef = this.dialog.open(DeviceEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Device) => {
      if(data){
        device.name = data.name;
        device.os = data.os;
        device.osMinVersion = data.osMinVersion;
        device.osMaxVersion = data.osMaxVersion;
        device.chipset = data.chipset;
        device.fingerprintScanner = data.fingerprintScanner;
        device.faceRecognition = data.faceRecognition;
      }
    })
  }


  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertMessage = "Something went wrong";
        break;
      case 404:
        this.alertMessage = error.error.message;
        break;
      default:
        this.alertMessage = "There was an error on the server, please try again later."
        break;
    }
    this.alertService.error(this.alertMessage,true,true);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}


import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Observable, ReplaySubject} from "rxjs";
import {AlertService, AuthService} from "../../_services";
import {Page} from "../../_models/page";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ViewTechniqueMitigationComponent } from '../view-technique-mitigation/view-technique-mitigation.component';
import { Sort, SortDirection } from '@angular/material/sort';
import { ModelGenerationDeviceFilter } from 'src/app/_models/_filters/model-generation-device-filter';
import { StandardSearchParams } from 'src/app/_models/standard-search-params';
import { DeviceService } from 'src/app/_services/device.service';
import { GeneratedModel } from 'src/app/_models/generated-model';
import { Device } from 'src/app/_models/device';
import { ModelGenerationService } from 'src/app/_services/model-generation.service';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';


@Component({
  selector: 'generation-selection',
  templateUrl: './generation-selection.component.html',
  styleUrls: ['./generation-selection.component.scss']
})
export class ModelGenerationComponent {
  length: number;
  deviceControl = new FormControl();
  devices: ModelGenerationDeviceFilter[] = [];
  filteredDevices: Observable<ModelGenerationDeviceFilter[]>;
  generatedModel: GeneratedModel;
  selectedDeviceId: string;
  searchForm: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['technique', 'mitigation'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  sortOrder: SortDirection = 'asc';

  constructor(
    private deviceService: DeviceService,
    private modelGenerationService: ModelGenerationService,
    private techniqueMitigationService: TechniqueMitigationService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
  }
  

  ngOnInit(): void {
    this.searchForm = this.createFormGroup();
    this.filteredDevices = this.deviceControl.valueChanges.pipe(
      startWith(null),
      map((device: string) => (device ? this.filterDevices(device) : this.devices.slice())),
    );
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      categories: ['']
    });
  }

  getDevices(searchText: string) {
    this.devices = [];
    const searchParams: StandardSearchParams = {name: searchText, order: 'asc'};
    this.deviceService.getDevicesBySearch(searchParams, 10)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          for (let device of response.content) {
            if(device.id !== undefined) {
              this.devices.push({ name: device.name, id: device.id});
            }
          }
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  filterDevices(value: string): ModelGenerationDeviceFilter[] {
    this.getDevices(String(value));
    return this.devices;
  }

  generateModel() : void {
    if (this.deviceControl.valid) {
      this.modelGenerationService.generateModelById(this.selectedDeviceId)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            this.generatedModel = response;
            this.alertService.success('Чек-лист було згенеровано', true, true);
          },
          error: error => {
            this.displayError(error);
          }
        });
      }
  }

  onDeviceSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedDeviceId = event.option.value.id;
  }

  displayDevice(device: Device): string {
    return device ? device.name : '';
  }

  openTechniqueDialog(id: string): void {
    console.log(id);
    this.techniqueMitigationService.getTechniqueById(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            const dialogRef = this.dialog.open(ViewTechniqueMitigationComponent, {
              data: {techniqueMitigation: response}
            });
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              default:
                this.alertService.error("несподівана помилка, спробуйте пізніше", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
  }

  openMitigationDialog(id: string): void {
    this.techniqueMitigationService.getMitigationById(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            const dialogRef = this.dialog.open(ViewTechniqueMitigationComponent, {
              data: {techniqueMitigation: response}
            });
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              default:
                this.alertService.error("несподівана помилка, спробуйте пізніше", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
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


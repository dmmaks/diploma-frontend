import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {Kitchenware} from "../../_models/kitchenware";
import {KitchenwareService} from "../../_services/kitchenware.service";
import { Device } from 'src/app/_models/device';
import { DevicePredefinedValues } from 'src/app/_models/device-predefined-values';
import { DeviceService } from 'src/app/_services/device.service';

@Component({
  selector: 'app-edit-kitchenware',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.scss']
})
export class DeviceEditComponent implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  device: Device;
  alertMessage: string;
  devicePredefinedValues: DevicePredefinedValues;

  constructor(
    public dialogRef: MatDialogRef<DeviceEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: DeviceService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.device = this.data.device;
    console.log(this.device);
    this.service.getDevicePredefinedValues()
    .pipe(takeUntil(this.destroy))
    .subscribe({
      next: response => {
        this.devicePredefinedValues = response;
        console.log(this.device);
      },
      error: error => {
        this.alertService.error("Сталася помилка.", false, false, "error-dialog");
      }
    });
    this.form = this.formBuilder.group({
      id: [this.device.id],
      name: [this.device.name, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      os: [this.device.os, [Validators.required]],
      osMinVersion: [this.device.osMinVersion, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      osMaxVersion: [this.device.osMaxVersion, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      chipset: [this.device.chipset, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      fingerprintScanner: [this.device.fingerprintScanner],
      faceRecognition: [this.device.faceRecognition]
    });
  }

  public editDevice(): void {
    if (this.form.valid) {
      const device : Device = this.form.value;
      this.service.editDevice(device)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Пристрій оновлено", true, true);
            this.dialogRef.close(device);
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error("Пристрій не знайдено", false, false, "error-dialog");
                break;
              default:
                this.alertService.error("Несподівана помилка, спробуйте пізніше", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

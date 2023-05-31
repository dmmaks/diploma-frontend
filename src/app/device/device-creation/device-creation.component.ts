import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import { DevicePredefinedValues } from 'src/app/_models/device-predefined-values';
import { DeviceService } from 'src/app/_services/device.service';
import { Device } from 'src/app/_models/device';

@Component({
  selector: 'app-device-creation',
  templateUrl: './device-creation.component.html',
  styleUrls: ['./device-creation.component.scss']
})
export class DeviceCreationComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  alertMessage: string;
  devicePredefinedValues: DevicePredefinedValues;

  constructor(
    public dialogRef: MatDialogRef<DeviceCreationComponent>,
    public service: DeviceService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.service.getDevicePredefinedValues()
    .pipe(takeUntil(this.destroy))
    .subscribe({
      next: response => {
        this.devicePredefinedValues = response;
      },
      error: error => {
        this.alertService.error("Сталася помилка.", false, false, "error-dialog");
      }
    });
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      os: ['', [Validators.required]],
      osMinVersion: [null, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      osMaxVersion: [null, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      chipset: [null, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,40}$')]],
      fingerprintScanner: [''],
      faceRecognition: ['']
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    if (this.form.valid) {
      const device : Device = this.form.value;
      this.service.createDevice(device)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Пристрій успішно створено.", true, true);
            this.dialogRef.close();
          },
          error: error => {
            this.alertService.error("Сталася помилка.", false, false, "error-dialog");
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

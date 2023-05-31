import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AlertService} from 'src/app/_services';
import { DevicePredefinedValues } from 'src/app/_models/device-predefined-values';
import { TechniqueMitigation } from 'src/app/_models/technique-mitigation';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';
import { Applicability } from 'src/app/_models/applicability';
import { TechniqueMitigationWithLinks } from 'src/app/_models/technique-mitigation-with-links';
import { LinksEditComponent } from '../links-edit/links-edit.component';
import { DeviceService } from 'src/app/_services/device.service';

@Component({
  selector: 'technique-add-edit',
  templateUrl: './technique-add-edit.component.html',
  styleUrls: ['./technique-add-edit.component.scss']
})
export class TechniqueAddEditComponent implements OnInit {

  columnsToDisplay: string[] = ['name', 'description', 'actions'];
  devicePredefinedValues: DevicePredefinedValues;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  technique: TechniqueMitigationWithLinks;
  applicability: Applicability;
  title: string;
  modeEdit: boolean = false;
  form: FormGroup;

  constructor(
    private dialog: MatDialog,
    private techniqueMitigationService: TechniqueMitigationService,
    private deviceService: DeviceService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.modeEdit = true;
      this.techniqueMitigationService.getTechniqueWithLinksById(id).pipe(takeUntil(this.destroy)).subscribe({
        next: (data: TechniqueMitigationWithLinks) => {
          this.technique = data;
          this.technique.id = id;
          this.form.addControl('name', new FormControl(this.technique.name, [Validators.required, Validators.maxLength(40)]));
          this.form.addControl('description', new FormControl(this.technique.description, [Validators.required, Validators.maxLength(1000)]));
        },
        error: () => this.router.navigate(['/techniques'])
      });
      this.techniqueMitigationService.getApplicabilityByTechniqueId(id).pipe(takeUntil(this.destroy)).subscribe({
        next: (data: Applicability) => {
          this.applicability = data;
          this.form.addControl('os', new FormControl(this.applicability.os, [Validators.required, Validators.maxLength(40)]));
          this.form.addControl('osMinVersion', new FormControl(this.applicability.osMinVersion, [Validators.maxLength(10)]));
          this.form.addControl('osMaxVersion', new FormControl(this.applicability.osMaxVersion, [Validators.maxLength(10)]));
          this.form.addControl('chipset', new FormControl(this.applicability.chipset, [Validators.maxLength(40)]));
          this.form.addControl('fingerprintScanner', new FormControl(this.applicability.fingerprintScanner));
          this.form.addControl('faceRecognition', new FormControl(this.applicability.faceRecognition));
        },
        error: () => this.router.navigate(['/techniques'])
      });
    }
    else {
      this.technique = { id: "", name: "", description: "", links: [] }
      this.applicability = { os: "", osMinVersion: "", osMaxVersion: "", chipset: "", fingerprintScanner: "", faceRecognition: "" }
      this.form = this.formBuilder.group({
        name: ['', [Validators.required, Validators.maxLength(40)]],
        description: ['', [Validators.required, Validators.maxLength(1000)]],
        os: [''],
        osMinVersion: ['', [Validators.maxLength(10)]],
        osMaxVersion: ['', [Validators.maxLength(10)]],
        chipset: ['', [Validators.maxLength(40)]],
        fingerprintScanner: [''],
        faceRecognition: ['']
      });
    }
    this.title = this.modeEdit ? "Редагування загрози" : "Додавання загрози";
    this.getDevicePredefinedValues();
  }

  addLink(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      selectedLinks: this.technique.links
    }
    const dialogRef = this.dialog.open(LinksEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: TechniqueMitigation[]) => this.technique.links = [...data]);
  }

  getDevicePredefinedValues(): void {
    this.deviceService.getDevicePredefinedValues().pipe(takeUntil(this.destroy))
      .subscribe({
        next: data => this.devicePredefinedValues = data,
        error: () => this.technique.links = []
      });
  }

  removeLink(id: string): void {
    this.technique.links = this.technique.links.filter(v => v.id != id);
  }

  onSubmitForm(): void {
    this.alertService.clear();
    if (this.form.valid) {
      if (!this.modeEdit) {
        this.applicability = { os: this.form.value.os, osMinVersion: this.form.value.osMinVersion, osMaxVersion: this.form.value.osMaxVersion, 
          chipset: this.form.value.chipset, fingerprintScanner: this.form.value.fingerprintScanner, faceRecognition: this.form.value.faceRecognition }
          console.log(this.applicability);
        this.techniqueMitigationService.createTechnique({ techniqueWithLinks: this.technique, applicability: this.applicability }).pipe(takeUntil(this.destroy)).subscribe({
          next: () => {
            this.alertService.success("Загрозу додано.", true, true);
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
          },
          error: () => this.alertService.error("Сталася серверна помилка.", false, false)
        });
      }
      else {
        this.applicability = { os: this.form.value.os, osMinVersion: this.form.value.osMinVersion, osMaxVersion: this.form.value.osMaxVersion, 
          chipset: this.form.value.chipset, fingerprintScanner: this.form.value.fingerprintScanner, faceRecognition: this.form.value.faceRecognition }
          console.log(this.applicability);
        this.techniqueMitigationService.editTechnique({ techniqueWithLinks: this.technique, applicability: this.applicability }).pipe(takeUntil(this.destroy)).subscribe({
          next: () => {
            this.alertService.success("Загрозу оновлено.", true, true);
            this.router.navigateByUrl("/techniques");
          },
          error: () => this.alertService.error("Сталася серверна помилка.", false, false)
        });
      }
    }
  }
}

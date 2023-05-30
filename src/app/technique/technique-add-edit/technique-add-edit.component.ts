import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Dish, Ingredient, NewKitchenware } from 'src/app/_models';
import { AlertService, DishService, IngredientService } from 'src/app/_services';
import { KitchenwareService } from 'src/app/_services/kitchenware.service';
import { DishFormError } from './technique-form-error';
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
export class TechniqueAddEditComponent extends DishFormError implements OnInit {

columnsToDisplay: string[] = ['name', 'actions'];
devicePredefinedValues: DevicePredefinedValues;
destroy: ReplaySubject<any> = new ReplaySubject<any>();
technique: TechniqueMitigationWithLinks;
applicability: Applicability;
title: string;
modeEdit: boolean = false;

  constructor(
    private dialog: MatDialog,
    private techniqueMitigationService: TechniqueMitigationService,
    private deviceService: DeviceService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    super();
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

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id){
      this.modeEdit = true;
      this.techniqueMitigationService.getTechniqueWithLinksById(id).pipe(takeUntil(this.destroy)).subscribe({
        next: (data: TechniqueMitigationWithLinks) => {this.technique = data; this.technique.id = id},
        error: () => this.router.navigate(['/techniques'])
      });
      // add getting of applicability
    }
    else {
      this.technique = { id: "", name: "", description: "", links: []}
      this.applicability = {os: "", osMinVersion: "", osMaxVersion: "", chipset: "", fingerprintScanner: "", faceRecognition: ""}
    }
    this.title = this.modeEdit ? "Редагування загрози" : "Додавання загрози";
    this.getDevicePredefinedValues();
  }

  addLink(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = { 
      selectedLinks: this.technique.links;
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
    if(this.form.valid){
      if(!this.modeEdit){
      this.dishService.createDish(this.dishModel).pipe(takeUntil(this.destroy)).subscribe({
        next: () => {
          this.alertService.success("Dish successfully added!", true, true);
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        },
        error: () => this.alertService.error("There was a server error. Please try again later.", false, false, "formDish")
      });
      }
    else {
      this.dishService.editDish(this.dishModel).pipe(takeUntil(this.destroy)).subscribe({
        next: () => {
          this.alertService.success("Dish successfully updated!", true, true);
          this.router.navigateByUrl("/dishes");
        },
        error: () => this.alertService.error("There was a server error. Please try again later.", false, false, "formDish")
      });
    }
  }
  }
}

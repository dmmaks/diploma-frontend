import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, ReplaySubject} from "rxjs";
import {AlertService, AuthService} from "../../_services";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ViewTechniqueMitigationComponent } from '../view-technique-mitigation/view-technique-mitigation.component';
import { Sort, SortDirection } from '@angular/material/sort';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';
import { Checklist } from 'src/app/_models/checklist';
import { ChecklistService } from 'src/app/_services/checklist.service';
import { DeletionConfirmationComponent } from '../deletion-confirmation/deletion-confirmation.component';
import { ChecklistEditComponent } from '../checklist-edit/checklist-edit.component';


@Component({
  selector: 'checklist-list-page.component',
  templateUrl: './checklist-list-page.component.html',
  styleUrls: ['./checklist-list-page.component.scss']
})
export class ChecklistListPageComponent {
  checklists: Checklist[] = [];
  searchForm: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['checklist', 'device', 'actions'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  sortOrder: SortDirection = 'asc';

  constructor(
    private checklistService: ChecklistService,
    private techniqueMitigationService: TechniqueMitigationService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
  }
  

  ngOnInit(): void {
    this.searchForm = this.createFormGroup();
    this.getChecklistsBySearch("");
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['']
    });
  }

  getChecklistsBySearch(searchText: string) : void {
    this.checklists = [];
    this.checklistService.getChecklists(searchText)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.checklists = response
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  performSearch() : void {
    this.getChecklistsBySearch(this.searchForm.value.name);
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

  confirmDeletion(id: string): void {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.checklistService.deleteChecklist(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("Чек-лист видалено",true,true);
          this.performSearch();
        },
        error: error => {
          this.displayError(error);
        }
      });
      }
    });
  }

  editChecklist(checklist: Checklist){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, checklist);
    dialogConfig.data = {
      checklist: dataDialog
    };
    const dialogRef = this.dialog.open(ChecklistEditComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Checklist) => {
      if(data){
        checklist.name = data.name;
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


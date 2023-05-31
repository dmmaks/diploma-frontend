import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Observable, ReplaySubject} from "rxjs";
import {AlertService} from "../../_services";
import {Page} from "../../_models/page";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Sort, SortDirection } from '@angular/material/sort';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';
import { DeletionConfirmationComponent } from '../deletion-confirmation/deletion-confirmation.component';
import { StandardSearchParams } from 'src/app/_models/standard-search-params';
import { TechniqueMitigation } from 'src/app/_models/technique-mitigation';
import { TechniqueInfoComponent } from '../technique-info/technique-info.component';


@Component({
  selector: 'technique-list-page',
  templateUrl: './technique-list-page.component.html',
  styleUrls: ['./technique-list-page.component.scss']
})
export class TechniqueListPageComponent {

  pageContent: Page<TechniqueMitigation>;;
  searchForm: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['name', 'description', 'actions'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  sortOrder: SortDirection = 'asc';

  constructor(
    private techniqueMitigationService: TechniqueMitigationService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
  }
  

  ngOnInit(): void {
    this.searchForm = this.createFormGroup();
    this.getTechniquesBySearch();
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['']
    });
  }


  getTechniquesBySearch(): void {
    const filter: StandardSearchParams = this.searchForm.value;
    filter.order = this.sortOrder;
    this.techniqueMitigationService.getTechniquesBySearch(this.searchForm.value, this.pageSize)
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

  getTechniquePage(pageIndex: number, pageSize: number): void {
    this.techniqueMitigationService.getTechniquesByPageNum(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          if (response.content.length === 0) {
            this.getTechniquePage(pageIndex - 1, pageSize);
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
        this.techniqueMitigationService.deleteTechnique(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("Загрозу видалено",true,true);
          this.getTechniquePage(this.currentPage, this.pageSize);
        },
        error: error => {
          this.displayError("Виникла помилка");
        }
      });
      }
    });
  }

  sortData(sortOrder: string) : void {
    sortOrder === 'desc' ? this.sortOrder = 'desc' : this.sortOrder = 'asc';
    this.getTechniquesBySearch();
  }


  paginationHandler(pageEvent: PageEvent): void {
      this.getTechniquePage(pageEvent.pageIndex, pageEvent.pageSize);
  }

  openTechniqueDialog(id: string): void {
    this.techniqueMitigationService.getTechniqueById(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            const dialogRef = this.dialog.open(TechniqueInfoComponent, {
              data: {technique: response}
            });
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error("Загрозу не знайдено", false, false, "error-dialog");
                break;
              default:
                this.alertService.error("Несподівана помилка, спробуйте пізніше", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
  }

  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertMessage = "Щось пішло не так.";
        break;
      case 404:
        this.alertMessage = "Загрозу не знайдено.";
        break;
      default:
        this.alertMessage = "Трапилася серверна помилка, спробуйте пізніше."
        break;
    }
    this.alertService.error(this.alertMessage,true,true);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}


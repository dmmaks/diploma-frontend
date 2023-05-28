import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, concatAll, delay, from, of, takeUntil, startWith} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, DishService } from '../../_services';
import { Checklist } from 'src/app/_models/checklist';
import { ChecklistService } from 'src/app/_services/checklist.service';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';
import { ViewTechniqueMitigationComponent } from '../view-technique-mitigation/view-technique-mitigation.component';
import { MatDialog } from '@angular/material/dialog';
import { Device } from 'src/app/_models/device';
import { DeviceService } from 'src/app/_services/device.service';

@Component({
  selector: 'app-checklist-info',
  templateUrl: './checklist-info.component.html',
  styleUrls: ['./checklist-info.component.scss'],
})
export class ChecklistInfoComponent implements OnInit {
  length: number;
  checklist: Checklist;
  device: Device;
  columnsToDisplay = ['technique', 'mitigation', 'tick'];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isNotFound: boolean = false;
  alertMessage: string;
  currentProgress: number;
  progressIncrement: number;
  progressValue$: any; 

  constructor(
    private checklistService: ChecklistService, 
    private techniqueMitigationService: TechniqueMitigationService, 
    private route: ActivatedRoute, 
    private alertService: AlertService, 
    private dialog: MatDialog,
    private router: Router) {
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id && Number(id)) {
      this.getChecklistInfo(id);
    }
    else {
      this.router.navigateByUrl("/checklists");
    }
  }

  private getChecklistInfo(id: string) : void {
    this.checklistService.getChecklistById(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.checklist = response;
          this.progressIncrement = 1 / (response.entries.length) * 100;
          const checkedEntriesCount: number = response.entries.filter((obj) => {
            return obj.checked === true;
          }).length;
          this.currentProgress = checkedEntriesCount / response.entries.length * 100;
          this.progressValue$ = from([
            of(this.currentProgress).pipe(delay(800))
          ]).pipe(
            startWith(of(this.currentProgress)),
            concatAll()
          );
          },
          error: error => {
            this.displayError(error);
          }}
      );
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

  changeIsChecked(index: number, id: string, checked: boolean): void {
    this.alertService.clear();
    let multiplier: number = 1;
    if (checked) {
      multiplier = -1;
    } 
    this.progressValue$ = from ([
      of(this.currentProgress + this.progressIncrement * multiplier).pipe(delay(200))
    ]).pipe(
      startWith(of(this.currentProgress)),
      concatAll()
    );
    this.currentProgress += this.progressIncrement * multiplier;
    this.checklistService.changeIsChecked(id, !checked)
      .pipe(takeUntil(this.destroy))
      .subscribe({
          next: () => {
            this.checklist.entries[index].checked = !checked;
          },
          error: error => {
            if (error.status == 404) {
              this.alertService.error(error.error.message, false, true);

            } else {
              this.alertService.error("Сталася помилка, будь ласка повторіть пізніше.", false, true);

            }
          }
        }
      )
  
  }
  
  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertService.error("Щось пішло не так",true,true);
        break;
      case 404:
        this.isNotFound = true;
        break;
      default:
        this.alertService.error("Сталася помилка на сервері, будь ласка повторіть пізніше.",true,true);
        break;
    }
    
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}

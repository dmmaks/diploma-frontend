import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Applicability } from 'src/app/_models/applicability';
import { TechniqueMitigation } from 'src/app/_models/technique-mitigation';
import { AlertService } from 'src/app/_services';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';

@Component({
  selector: 'technique-info',
  templateUrl: './technique-info.component.html',
  styleUrls: ['./technique-info.component.scss']
})
export class TechniqueInfoComponent implements OnInit {

    technique: TechniqueMitigation;
    applicability: Applicability;
    destroy: ReplaySubject<any> = new ReplaySubject<any>();
  
    constructor(public dialogRef: MatDialogRef<TechniqueInfoComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any, 
       private techniqueMitigationService : TechniqueMitigationService,
       private alertService: AlertService) {
    }
  
    ngOnInit(): void {
      this.technique = this.data.technique;
      this.techniqueMitigationService.getApplicabilityByTechniqueId(this.technique.id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            this.applicability = response;
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error("Загрозу не знайдено.", false, false, "error-dialog");
                break;
              default:
                this.alertService.error("Несподівана помилка, спробуйте пізніше.", false, false, "error-dialog");
                break;
            }
          }});
    }

    close(): void {
      this.dialogRef.close();
    }

    ngOnDestroy(): void {
      this.destroy.next(null);
      this.destroy.complete();
    }
  }
  

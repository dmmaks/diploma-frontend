import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import { Checklist } from 'src/app/_models/checklist';
import { ChecklistService } from 'src/app/_services/checklist.service';

@Component({
  selector: 'app-checklist-edit',
  templateUrl: './checklist-edit.component.html',
  styleUrls: ['./checklist-edit.component.scss']
})
export class ChecklistEditComponent implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  checklist: Checklist;
  alertMessage: string;

  constructor(
    public dialogRef: MatDialogRef<ChecklistEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public checklistService: ChecklistService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  close(): void {
    this.dialogRef.close();
  }

  public editChecklist(): void {
    if (this.form.valid) {
      const checklist : Checklist = this.form.value;
      this.checklistService.editChecklist(checklist.name, checklist.id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Чек-лист оновлено.", true, true);
            this.dialogRef.close(checklist);
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error("Чек-лист не знайдено", false, false, "error-dialog");
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

  ngOnInit(): void {
    this.checklist = this.data.checklist;
    this.form = this.formBuilder.group({
      id: [this.data.checklist.id],
      name: [this.data.checklist.name, [Validators.required, Validators.pattern('^.{1,50}$')]],
    });
  }
}

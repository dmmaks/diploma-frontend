import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { TechniqueMitigation } from 'src/app/_models/technique-mitigation';

@Component({
  selector: 'technique-info',
  templateUrl: './technique-info.component.html',
  styleUrls: ['./technique-info.component.scss']
})
export class TechniqueInfoComponent implements OnInit {

    technique: TechniqueMitigation;
    destroy: ReplaySubject<any> = new ReplaySubject<any>();
  
    constructor(public dialogRef: MatDialogRef<TechniqueInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }
  
    ngOnInit(): void {
      this.technique = this.data.technique;
    }

    close(): void {
      this.dialogRef.close();
    }

    ngOnDestroy(): void {
      this.destroy.next(null);
      this.destroy.complete();
    }
  }
  

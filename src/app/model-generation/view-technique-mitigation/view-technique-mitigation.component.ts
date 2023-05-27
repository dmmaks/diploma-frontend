import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { TechniqueMitigation } from 'src/app/_models/technique-mitigation';

@Component({
  selector: 'view-technique-mitigation',
  templateUrl: './view-technique-mitigation.component.html',
  styleUrls: ['./view-technique-mitigation.component.scss']
})
export class ViewTechniqueMitigationComponent implements OnInit {

    techniqueMitigation: TechniqueMitigation;
    destroy: ReplaySubject<any> = new ReplaySubject<any>();
  
    constructor(public dialogRef: MatDialogRef<ViewTechniqueMitigationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }
  
    ngOnInit(): void {
      this.techniqueMitigation = this.data.techniqueMitigation;
    }

    close(): void {
      this.dialogRef.close();
    }

    ngOnDestroy(): void {
      this.destroy.next(null);
      this.destroy.complete();
    }
  }
  

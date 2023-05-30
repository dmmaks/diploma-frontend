import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { TechniqueMitigation } from 'src/app/_models/technique-mitigation';

@Component({
  selector: 'mitigation-info',
  templateUrl: './mitigation-info.component.html',
  styleUrls: ['./mitigation-info.component.scss']
})
export class MitigationInfoComponent implements OnInit {

  mitigation: TechniqueMitigation;
    destroy: ReplaySubject<any> = new ReplaySubject<any>();
  
    constructor(public dialogRef: MatDialogRef<MitigationInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }
  
    ngOnInit(): void {
      this.mitigation = this.data.mitigation;
    }

    close(): void {
      this.dialogRef.close();
    }

    ngOnDestroy(): void {
      this.destroy.next(null);
      this.destroy.complete();
    }
  }
  

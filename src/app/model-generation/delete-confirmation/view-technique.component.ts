import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class ViewTechniqueComponent implements OnInit {
  
    constructor(public dialogRef: MatDialogRef<ViewTechniqueComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }
  
    ngOnInit() {
    }
  }
  

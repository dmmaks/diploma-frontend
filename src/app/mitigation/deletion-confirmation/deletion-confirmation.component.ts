import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-deletion-confirmation',
  templateUrl: './deletion-confirmation.component.html',
  styleUrls: ['./deletion-confirmation.component.scss']
})
export class DeletionConfirmationComponent implements OnInit {
  
    constructor(public dialogRef: MatDialogRef<DeletionConfirmationComponent>) {
    }
  
    ngOnInit() {
    }
  
    onConfirm(): void {
      this.dialogRef.close(true);
    }
  
    onDismiss(): void {
      this.dialogRef.close(false);
    }
  }
  

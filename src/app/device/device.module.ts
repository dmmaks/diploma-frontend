import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChecklistRoutingModule} from "./device-routing.module";
import { ChecklistListPageComponent } from './device-list-page/device-list-page.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ChecklistEditComponent } from './device-edit/checklist-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { DeletionConfirmationComponent } from './deletion-confirmation/deletion-confirmation.component';



@NgModule({
  declarations: [
    LayoutComponent,
    ChecklistListPageComponent,
    ChecklistEditComponent,
    DeletionConfirmationComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
    ChecklistRoutingModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule
  ],
})
export class DeviceModule { }

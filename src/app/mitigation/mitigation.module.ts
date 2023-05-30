import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MitigationRoutingModule} from "./mitigation-routing.module";
import { MitigationListPageComponent } from './mitigation-list-page/mitigation-list-page.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { DeletionConfirmationComponent } from './deletion-confirmation/deletion-confirmation.component';
import { MitigationInfoComponent } from './mitigation-info/mitigation-info.component';
import {MitigationAddEditComponent} from "./mitigation-add-edit/mitigation-add-edit.component";
import {LinksEditComponent} from "./links-edit/links-edit.component";



@NgModule({
  declarations: [
    LayoutComponent,
    MitigationListPageComponent,
    DeletionConfirmationComponent,
    MitigationInfoComponent,
    MitigationAddEditComponent,
    LinksEditComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
    MitigationRoutingModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule
  ],
})
export class MitigationModule { }

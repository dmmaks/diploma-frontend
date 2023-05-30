import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TechniqueRoutingModule} from "./technique-routing.module";
import { TechniqueListPageComponent } from './technique-list-page/technique-list-page.component';
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
import { TechniqueInfoComponent } from './technique-info/technique-info.component';
import {TechniqueAddEditComponent} from "./technique-add-edit/technique-add-edit.component";
import {LinksEditComponent} from "./links-edit/links-edit.component";



@NgModule({
  declarations: [
    LayoutComponent,
    TechniqueListPageComponent,
    DeletionConfirmationComponent,
    TechniqueInfoComponent,
    TechniqueAddEditComponent,
    LinksEditComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
    TechniqueRoutingModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule
  ],
})
export class TechniqueModule { }

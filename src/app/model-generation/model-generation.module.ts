import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelGenerationRoutingModule} from "./model-generation-routing.module";
import { ModelGenerationComponent } from './generation-selection/generation-selection.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { ViewTechniqueMitigationComponent } from './view-technique-mitigation/view-technique-mitigation.component';



@NgModule({
  declarations: [
    LayoutComponent,
    ModelGenerationComponent,
    ViewTechniqueMitigationComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
    ModelGenerationRoutingModule,
    MatDialogModule
  ],
})
export class ModelGenerationModule { }

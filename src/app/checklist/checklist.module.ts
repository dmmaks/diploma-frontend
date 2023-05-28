import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChecklistRoutingModule} from "./checklist-routing.module";
import { ModelGenerationComponent } from './generation-selection/generation-selection.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

import { DishAddEditComponent } from './dish-add-edit/dish-add-edit.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { KitchenwareEditComponent } from './kitchenware-edit/kitchenware-edit.component';
import { ViewTechniqueMitigationComponent } from './view-technique-mitigation/view-technique-mitigation.component';
import { ChecklistInfoComponent } from './checklist-info/checklist-info.component';



@NgModule({
  declarations: [
    LayoutComponent,
    ModelGenerationComponent,
    DishAddEditComponent,
    IngredientEditComponent,
    KitchenwareEditComponent,
    ViewTechniqueMitigationComponent,
    ChecklistInfoComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
    ChecklistRoutingModule,
    MatDialogModule
  ],
})
export class ChecklistModule { }

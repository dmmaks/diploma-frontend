import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChecklistRoutingModule} from "./checklist-routing.module";
import { ChecklistListPageComponent } from './checklist-list-page/checklist-list-page.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DishAddEditComponent } from './dish-add-edit/dish-add-edit.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { KitchenwareEditComponent } from './kitchenware-edit/kitchenware-edit.component';
import { ViewTechniqueMitigationComponent } from './view-technique-mitigation/view-technique-mitigation.component';
import { ChecklistInfoComponent } from './checklist-info/checklist-info.component';
import { MatButtonModule } from '@angular/material/button';
import { DeletionConfirmationComponent } from './deletion-confirmation/deletion-confirmation.component';



@NgModule({
  declarations: [
    LayoutComponent,
    ChecklistListPageComponent,
    DishAddEditComponent,
    IngredientEditComponent,
    KitchenwareEditComponent,
    ViewTechniqueMitigationComponent,
    ChecklistInfoComponent,
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
export class ChecklistModule { }

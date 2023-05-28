import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ModelGenerationComponent} from "./generation-selection/generation-selection.component";
import { DishAddEditComponent } from './dish-add-edit/dish-add-edit.component';
import { ChecklistInfoComponent } from './checklist-info/checklist-info.component';


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: ModelGenerationComponent},
     {path: 'add', component: DishAddEditComponent},
     {path:':id', component: ChecklistInfoComponent},
    { path: 'edit/:id', component: DishAddEditComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistRoutingModule { }

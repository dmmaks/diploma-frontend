import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ChecklistListPageComponent} from "./checklist-list-page/checklist-list-page.component";
import { ChecklistInfoComponent } from './checklist-info/checklist-info.component';


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: ChecklistListPageComponent},
     {path:':id', component: ChecklistInfoComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistRoutingModule { }

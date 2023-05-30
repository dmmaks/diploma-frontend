import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {MitigationListPageComponent} from "./mitigation-list-page/mitigation-list-page.component";
import {MitigationAddEditComponent} from "./mitigation-add-edit/mitigation-add-edit.component";


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: MitigationListPageComponent},
     {path: 'add', component: MitigationAddEditComponent},
    { path: 'edit/:id', component: MitigationAddEditComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MitigationRoutingModule { }

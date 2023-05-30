import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {TechniqueListPageComponent} from "./technique-list-page/technique-list-page.component";
import {TechniqueAddEditComponent} from "./technique-add-edit/technique-add-edit.component";


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: TechniqueListPageComponent},
     {path: 'add', component: TechniqueAddEditComponent},
    { path: 'edit/:id', component: TechniqueAddEditComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechniqueRoutingModule { }

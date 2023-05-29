import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {DeviceListPageComponent} from "./device-list-page/device-list-page.component";


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: DeviceListPageComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }

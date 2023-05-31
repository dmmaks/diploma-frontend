import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthFormsGuard, AuthGuard} from './_helpers';
import {Role} from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const modelGenerationModule = () => import('./model-generation/model-generation.module').then(x => x.ModelGenerationModule);
const checklistModule = () => import('./checklist/checklist.module').then(x => x.ChecklistModule);
const deviceModule = () => import('./device/device.module').then(x => x.DeviceModule);
const techniqueModule = () => import('./technique/technique.module').then(x => x.TechniqueModule);
const mitigationModule = () => import('./mitigation/mitigation.module').then(x => x.MitigationModule);

const routes: Routes = [
  { path: '', redirectTo: '/account/signin', pathMatch: 'full' },
  { path: 'account', loadChildren: accountModule, canActivate: [AuthFormsGuard] },
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.User] } },
  { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
  { path: 'model-generation', loadChildren: modelGenerationModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.User, Role.Moderator] } },
  { path: 'checklists', loadChildren: checklistModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.User, Role.Moderator] } },
  { path: 'devices', loadChildren: deviceModule, canActivate: [AuthGuard], data: { roles: [Role.Moderator] } },
  { path: 'techniques', loadChildren: techniqueModule, canActivate: [AuthGuard], data: { roles: [Role.Moderator] } },
  { path: 'mitigations', loadChildren: mitigationModule, canActivate: [AuthGuard], data: { roles: [Role.Moderator] } },
  { path: '**', redirectTo: '/account/signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthFormsGuard, AuthGuard} from './_helpers';
import {Role} from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

const kitchenwareModule = () => import('./kitchenware/kitchenware.module').then(x => x.KitchenwareModule);
const ingredientModule = () => import('./ingredient/ingredient.module').then(x => x.IngredientModule);
const stockModule = () => import('./stock/stock.module').then(x => x.StockModule);
const friendsModule = () => import('./friends/friends.module').then(x => x.FriendsModule);
const dishModule = () => import('./dish/dish.module').then(x => x.DishModule);
const modelGenerationModule = () => import('./model-generation/model-generation.module').then(x => x.ModelGenerationModule);
const checklistModule = () => import('./checklist/checklist.module').then(x => x.ChecklistModule);
const deviceModule = () => import('./device/device.module').then(x => x.DeviceModule);
const techniqueModule = () => import('./technique/technique.module').then(x => x.TechniqueModule);

const routes: Routes = [
  { path: '', redirectTo: '/account/signin', pathMatch: 'full' },
  { path: 'account', loadChildren: accountModule, canActivate: [AuthFormsGuard] },
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.User] } },
  { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
  { path: 'friends', loadChildren: friendsModule, canActivate: [AuthGuard] },
  { path: 'kitchenware', loadChildren: kitchenwareModule, canActivate: [AuthGuard], data: { roles: [Role.Moderator]} },
  { path: 'ingredients', loadChildren: ingredientModule, canActivate: [AuthGuard], data: { roles: [Role.Moderator] } },
  { path: 'stock', loadChildren: stockModule, canActivate: [AuthGuard], data: { roles: [Role.User] } },
  { path: 'dishes', loadChildren: dishModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.User, Role.Moderator] } },
  { path: 'model-generation', loadChildren: modelGenerationModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.User, Role.Moderator] } },
  { path: 'checklists', loadChildren: checklistModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.User, Role.Moderator] } },
  { path: 'devices', loadChildren: deviceModule, canActivate: [AuthGuard], data: { roles: [Role.Moderator] } },
  { path: 'techniques', loadChildren: techniqueModule, canActivate: [AuthGuard], data: { roles: [Role.Moderator] } },
  { path: '**', redirectTo: '/account/signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

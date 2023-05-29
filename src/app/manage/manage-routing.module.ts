import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../shared/error/error.component';
import { RolesManagementComponent } from './pages/roles-management/roles-management.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';

const routes: Routes = [
  { 
    path: '', 
    children: [
      { path: 'usuarios',component: UsersManagementComponent},
      { path: 'roles',component: RolesManagementComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

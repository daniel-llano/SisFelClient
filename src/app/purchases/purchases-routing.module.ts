import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../shared/error/error.component';
import { ManagementComponent } from './management/management.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { 
    path: '', 
    children: [
      { path: 'registro',component: RegisterComponent},
      { path: 'gestion',component: ManagementComponent},
      { path: '**', component: ErrorComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }

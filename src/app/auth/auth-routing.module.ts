import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from '../shared/error/error.component';

const routes: Routes = [
  //Add routes 
  { path: '', children: [
    { path: '',component: LoginComponent},
    { path: 'login',component: LoginComponent}
    
  ] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

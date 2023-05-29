import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmisionComponent } from './components/emision/emision.component';
import { ErrorComponent } from '../shared/error/error.component';
import { ManagementComponent } from './components/management/management.component';
import { PendingInvoicesComponent } from './components/pending-invoices/pending-invoices.component';
import { MassInvoicesComponent } from './components/mass-invoices/mass-invoices/mass-invoices.component';


const routes: Routes = [
  { 
    path: '', 
    children: [
      { path: 'individual',component: EmisionComponent},
      { path: 'gestion',component: ManagementComponent},
      { path: 'pendientes',component: PendingInvoicesComponent},
      { path: 'masiva',component: MassInvoicesComponent},
      { path: '**', component: ErrorComponent}
      
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicingRoutingModule { }
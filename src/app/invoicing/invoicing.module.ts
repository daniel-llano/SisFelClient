import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmisionComponent } from './components/emision/emision.component';
import { ManagementComponent } from './components/management/management.component';

import { FormsModule } from '@angular/forms';

//PRIMENG
import { MenubarModule } from 'primeng/menubar';
import { AccordionModule } from 'primeng/accordion'; 
import { CalendarModule} from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule} from 'primeng/table';
import { DialogModule} from 'primeng/dialog';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { ToastModule} from 'primeng/toast';
import { InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SplitterModule } from 'primeng/splitter';
import { RadioButtonModule } from 'primeng/radiobutton';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ProgressBarModule} from 'primeng/progressbar';
//ROUTEADOR
import { InvoicingRoutingModule } from './invoicing-routing.module';
import { PendingInvoicesComponent } from './components/pending-invoices/pending-invoices.component';
import { MassInvoicesComponent } from './components/mass-invoices/mass-invoices/mass-invoices.component';


@NgModule({
  declarations: [
    EmisionComponent,
    ManagementComponent,
    PendingInvoicesComponent,
    MassInvoicesComponent
  ],
  imports: [
    CommonModule,
    InvoicingRoutingModule,
    FormsModule,
    MenubarModule,
    AccordionModule,
    CalendarModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    InvoicingRoutingModule,
    ButtonModule,
    SplitterModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    ScrollPanelModule,
    ProgressBarModule
  ]
})
export class InvoicingModule { }

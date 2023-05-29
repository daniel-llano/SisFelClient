import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';

// PRIMENG
import { InputTextModule} from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar'; 
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule} from 'primeng/toast';

// RUTEADOR
import { PurchasesRoutingModule } from './purchases-routing.module';



@NgModule({
  declarations: [
    ManagementComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    TableModule,
    DropdownModule,
    ProgressSpinnerModule,
    TooltipModule,
    ToastModule
  ]
})
export class PurchasesModule { }

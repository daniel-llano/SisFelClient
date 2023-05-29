import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNg
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

//Componententes
import { GeneraldataRoutingModule } from './generaldata-routing.module';
import { UnitsComponent } from './components/units/units.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CompanyDataComponent } from './components/company-data/company-data.component';
import { CertificateComponent } from './components/certificate/certificate.component';
import { SucursalesComponent } from './components/sucursales/sucursales.component';
import { PuntoventaComponent } from './components/puntoventa/puntoventa.component';

@NgModule({
  declarations: [
    UnitsComponent,
    CategoriesComponent,
    CompanyDataComponent,
    CertificateComponent,
    SucursalesComponent,
    PuntoventaComponent, 
  ],
  imports: [
    CommonModule,
    GeneraldataRoutingModule,
    ToolbarModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule, 
    RadioButtonModule, 
    DropdownModule,
    PaginatorModule
  ]
})
export class GeneraldataModule { }

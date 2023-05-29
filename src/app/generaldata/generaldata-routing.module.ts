import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../shared/error/error.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CertificateComponent } from './components/certificate/certificate.component';
import { CompanyDataComponent } from './components/company-data/company-data.component';
import { UnitsComponent } from './components/units/units.component';
import { SucursalesComponent } from './components/sucursales/sucursales.component';
import { PuntoventaComponent } from './components/puntoventa/puntoventa.component';

const routes: Routes = [
  {
    path : '',
    children: [
      { path: 'unidades', component: UnitsComponent},
      { path: 'categorias', component: CategoriesComponent},
      { path: 'empresa', component: CompanyDataComponent},
      { path: 'certificado', component: CertificateComponent},
      { path: 'sucursales', component: SucursalesComponent},
      { path: 'puntos_de_venta', component: PuntoventaComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneraldataRoutingModule { }

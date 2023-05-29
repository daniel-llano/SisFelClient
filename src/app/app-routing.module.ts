import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './shared/error/error.component';
import { HomeComponent } from './shared/error/pages/home/home.component';
import { LogoutComponent } from './auth/pages/logout/logout.component';

//Components

const routes: Routes = [
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'inicio', component : HomeComponent },
  { path: 'registrarse', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'general', loadChildren: () => import('./generaldata/generaldata.module').then(m => m.GeneraldataModule) },
  { path: 'productos', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'administrar', loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule) },
  { path: 'facturacion', loadChildren: () => import('./invoicing/invoicing.module').then(m => m.InvoicingModule) },
  { path: 'eventos', loadChildren: () => import('./eventos/eventos.module').then(m => m.EventosModule) },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'logout', component : LogoutComponent },
  { path: 'clientes', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
  { path: 'compras', loadChildren: () => import('./purchases/purchases.module').then(m => m.PurchasesModule) },
  { path: '**', component: ErrorComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

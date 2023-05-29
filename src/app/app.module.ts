import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// COMPONENTS
import { AppComponent } from './app.component';
import { ErrorComponent } from './shared/error/error.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './shared/error/pages/home/home.component';
import { FooterComponent } from './shared/footer/footer.component';
import { InvoiceToPrintComponent } from './invoicing/components/invoice-to-print/invoice-to-print.component';

// PrimeNg
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';

// QR
import { QRCodeModule } from 'angularx-qrcode';

// Http
import { HttpClientModule } from '@angular/common/http';

// Ruteador
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    InvoiceToPrintComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenubarModule,
    HttpClientModule,
    QRCodeModule,
    DropdownModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

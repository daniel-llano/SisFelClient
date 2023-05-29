import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ManageRoutingModule } from './manage-routing.module';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { RolesManagementComponent } from './pages/roles-management/roles-management.component';

//prime ng
import { MenubarModule } from 'primeng/menubar';
import { AccordionModule } from 'primeng/accordion'; 
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import {PaginatorModule} from 'primeng/paginator';



@NgModule({
  declarations: [
    UsersManagementComponent,
    RolesManagementComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    CommonModule,
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
    DropdownModule,
    ManageRoutingModule,
    MessageModule,
    MessagesModule,
    CheckboxModule,
    PasswordModule,
    RadioButtonModule,
    MultiSelectModule,
    PaginatorModule
  ]
})
export class ManageModule { }

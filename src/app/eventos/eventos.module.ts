import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
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
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';

//ROUTEADOR
import { EventosgRoutingModule } from './eventos-routing.module';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
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
    CommonModule,
    RadioButtonModule,
    PaginatorModule,
    EventosgRoutingModule
  ]
})
export class EventosModule { }
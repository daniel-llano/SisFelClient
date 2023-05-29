import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceToPrintComponent } from './invoice-to-print.component';

describe('InvoiceToPrintComponent', () => {
  let component: InvoiceToPrintComponent;
  let fixture: ComponentFixture<InvoiceToPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceToPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceToPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

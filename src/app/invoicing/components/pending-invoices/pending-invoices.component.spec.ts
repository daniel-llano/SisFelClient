import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingInvoicesComponent } from './pending-invoices.component';

describe('PendingInvoicesComponent', () => {
  let component: PendingInvoicesComponent;
  let fixture: ComponentFixture<PendingInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

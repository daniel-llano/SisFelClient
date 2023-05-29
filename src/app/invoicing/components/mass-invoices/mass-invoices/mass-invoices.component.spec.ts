import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassInvoicesComponent } from './mass-invoices.component';

describe('MassInvoicesComponent', () => {
  let component: MassInvoicesComponent;
  let fixture: ComponentFixture<MassInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MassInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPagosComponent } from './tipo-pagos.component';

describe('TipoPagosComponent', () => {
  let component: TipoPagosComponent;
  let fixture: ComponentFixture<TipoPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsMonedaComponent } from './ins-moneda.component';

describe('InsMonedaComponent', () => {
  let component: InsMonedaComponent;
  let fixture: ComponentFixture<InsMonedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsMonedaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsMonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

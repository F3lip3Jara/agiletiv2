import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsOpcionesComponent } from './ins-opciones.component';

describe('InsOpcionesComponent', () => {
  let component: InsOpcionesComponent;
  let fixture: ComponentFixture<InsOpcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsOpcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

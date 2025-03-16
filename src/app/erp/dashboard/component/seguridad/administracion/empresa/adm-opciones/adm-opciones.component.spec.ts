import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmOpcionesComponent } from './adm-opciones.component';

describe('AdmOpcionesComponent', () => {
  let component: AdmOpcionesComponent;
  let fixture: ComponentFixture<AdmOpcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmOpcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpOpcionesComponent } from './up-opciones.component';

describe('UpOpcionesComponent', () => {
  let component: UpOpcionesComponent;
  let fixture: ComponentFixture<UpOpcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpOpcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

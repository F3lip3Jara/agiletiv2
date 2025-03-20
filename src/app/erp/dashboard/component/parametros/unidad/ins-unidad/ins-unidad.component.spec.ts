import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsUnidadComponent } from './ins-unidad.component';

describe('InsUnidadComponent', () => {
  let component: InsUnidadComponent;
  let fixture: ComponentFixture<InsUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsUnidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

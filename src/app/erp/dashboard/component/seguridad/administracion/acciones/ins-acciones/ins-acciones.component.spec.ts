import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsAccionesComponent } from './ins-acciones.component';

describe('InsAccionesComponent', () => {
  let component: InsAccionesComponent;
  let fixture: ComponentFixture<InsAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsAccionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

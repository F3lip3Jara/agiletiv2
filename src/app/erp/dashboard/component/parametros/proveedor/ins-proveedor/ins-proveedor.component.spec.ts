import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsProveedorComponent } from './ins-proveedor.component';

describe('InsProveedorComponent', () => {
  let component: InsProveedorComponent;
  let fixture: ComponentFixture<InsProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsProveedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

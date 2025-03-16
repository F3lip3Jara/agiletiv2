import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsModuloComponent } from './ins-modulo.component';

describe('InsModuloComponent', () => {
  let component: InsModuloComponent;
  let fixture: ComponentFixture<InsModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsModuloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

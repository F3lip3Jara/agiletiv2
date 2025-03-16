import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsSubModuloComponent } from './ins-sub-modulo.component';

describe('InsSubModuloComponent', () => {
  let component: InsSubModuloComponent;
  let fixture: ComponentFixture<InsSubModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsSubModuloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsSubModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

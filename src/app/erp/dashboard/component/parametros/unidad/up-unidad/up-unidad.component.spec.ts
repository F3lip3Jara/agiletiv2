import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpUnidadComponent } from './up-unidad.component';

describe('UpUnidadComponent', () => {
  let component: UpUnidadComponent;
  let fixture: ComponentFixture<UpUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpUnidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

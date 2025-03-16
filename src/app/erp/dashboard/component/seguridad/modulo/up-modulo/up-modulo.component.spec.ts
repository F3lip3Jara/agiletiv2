import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpModuloComponent } from './up-modulo.component';

describe('UpModuloComponent', () => {
  let component: UpModuloComponent;
  let fixture: ComponentFixture<UpModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpModuloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

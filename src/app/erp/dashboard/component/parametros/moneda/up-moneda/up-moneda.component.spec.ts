import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpMonedaComponent } from './up-moneda.component';

describe('UpMonedaComponent', () => {
  let component: UpMonedaComponent;
  let fixture: ComponentFixture<UpMonedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpMonedaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpMonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpProductosComponent } from './up-productos.component';

describe('UpProductosComponent', () => {
  let component: UpProductosComponent;
  let fixture: ComponentFixture<UpProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

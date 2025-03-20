import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsClaseComponent } from './ins-clase.component';

describe('InsClaseComponent', () => {
  let component: InsClaseComponent;
  let fixture: ComponentFixture<InsClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsClaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

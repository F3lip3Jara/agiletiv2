import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpClaseComponent } from './up-clase.component';

describe('UpClaseComponent', () => {
  let component: UpClaseComponent;
  let fixture: ComponentFixture<UpClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpClaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

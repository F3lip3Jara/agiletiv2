import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsColorComponent } from './ins-color.component';

describe('InsColorComponent', () => {
  let component: InsColorComponent;
  let fixture: ComponentFixture<InsColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsColorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

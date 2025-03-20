import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpColorComponent } from './up-color.component';

describe('UpColorComponent', () => {
  let component: UpColorComponent;
  let fixture: ComponentFixture<UpColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpColorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

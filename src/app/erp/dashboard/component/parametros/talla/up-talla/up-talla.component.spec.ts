import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpTallaComponent } from './up-talla.component';

describe('UpTallaComponent', () => {
  let component: UpTallaComponent;
  let fixture: ComponentFixture<UpTallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpTallaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpTallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

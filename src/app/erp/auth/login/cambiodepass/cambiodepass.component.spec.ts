import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiodepassComponent } from './cambiodepass.component';

describe('CambiodepassComponent', () => {
  let component: CambiodepassComponent;
  let fixture: ComponentFixture<CambiodepassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiodepassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambiodepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

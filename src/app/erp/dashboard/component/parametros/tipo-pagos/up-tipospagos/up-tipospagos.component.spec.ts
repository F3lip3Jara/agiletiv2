import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpTipospagosComponent } from './up-tipospagos.component';

describe('UpTipospagosComponent', () => {
  let component: UpTipospagosComponent;
  let fixture: ComponentFixture<UpTipospagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpTipospagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpTipospagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

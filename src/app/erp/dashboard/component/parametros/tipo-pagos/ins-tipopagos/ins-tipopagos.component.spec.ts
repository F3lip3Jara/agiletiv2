import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsTipopagosComponent } from './ins-tipopagos.component';

describe('InsTipopagosComponent', () => {
  let component: InsTipopagosComponent;
  let fixture: ComponentFixture<InsTipopagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsTipopagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsTipopagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

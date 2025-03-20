import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsMotivoComponent } from './ins-motivo.component';

describe('InsMotivoComponent', () => {
  let component: InsMotivoComponent;
  let fixture: ComponentFixture<InsMotivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsMotivoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

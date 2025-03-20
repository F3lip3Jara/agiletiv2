import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpMotivoComponent } from './up-motivo.component';

describe('UpMotivoComponent', () => {
  let component: UpMotivoComponent;
  let fixture: ComponentFixture<UpMotivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpMotivoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

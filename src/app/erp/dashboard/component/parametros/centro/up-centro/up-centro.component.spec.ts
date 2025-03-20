import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpCentroComponent } from './up-centro.component';

describe('UpCentroComponent', () => {
  let component: UpCentroComponent;
  let fixture: ComponentFixture<UpCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpCentroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

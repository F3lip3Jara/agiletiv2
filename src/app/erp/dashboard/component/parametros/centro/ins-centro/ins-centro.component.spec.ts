import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsCentroComponent } from './ins-centro.component';

describe('InsCentroComponent', () => {
  let component: InsCentroComponent;
  let fixture: ComponentFixture<InsCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsCentroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

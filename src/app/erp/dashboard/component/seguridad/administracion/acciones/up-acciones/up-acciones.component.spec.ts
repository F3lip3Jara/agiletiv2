import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpAccionesComponent } from './up-acciones.component';

describe('UpAccionesComponent', () => {
  let component: UpAccionesComponent;
  let fixture: ComponentFixture<UpAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpAccionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

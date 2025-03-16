import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpSubModuloComponent } from './up-sub-modulo.component';

describe('UpSubModuloComponent', () => {
  let component: UpSubModuloComponent;
  let fixture: ComponentFixture<UpSubModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpSubModuloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpSubModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

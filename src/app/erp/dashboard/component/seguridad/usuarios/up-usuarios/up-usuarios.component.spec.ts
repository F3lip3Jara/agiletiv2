import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpUsuariosComponent } from './up-usuarios.component';

describe('UpUsuariosComponent', () => {
  let component: UpUsuariosComponent;
  let fixture: ComponentFixture<UpUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpUsuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpEmpresaComponent } from './up-empresa.component';

describe('UpEmpresaComponent', () => {
  let component: UpEmpresaComponent;
  let fixture: ComponentFixture<UpEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

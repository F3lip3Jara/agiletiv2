import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubModuloComponent } from './sub-modulo.component';

describe('SubModuloComponent', () => {
  let component: SubModuloComponent;
  let fixture: ComponentFixture<SubModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubModuloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

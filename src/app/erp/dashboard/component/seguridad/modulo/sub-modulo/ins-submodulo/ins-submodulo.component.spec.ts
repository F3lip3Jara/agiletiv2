import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsSubmoduloComponent } from './ins-submodulo.component';

describe('InsSubmoduloComponent', () => {
  let component: InsSubmoduloComponent;
  let fixture: ComponentFixture<InsSubmoduloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsSubmoduloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsSubmoduloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

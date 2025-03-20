import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsSubgrupoComponent } from './ins-subgrupo.component';

describe('InsSubgrupoComponent', () => {
  let component: InsSubgrupoComponent;
  let fixture: ComponentFixture<InsSubgrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsSubgrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsSubgrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

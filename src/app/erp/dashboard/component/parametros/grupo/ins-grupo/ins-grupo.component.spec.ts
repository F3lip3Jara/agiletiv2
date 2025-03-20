import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsGrupoComponent } from './ins-grupo.component';

describe('InsGrupoComponent', () => {
  let component: InsGrupoComponent;
  let fixture: ComponentFixture<InsGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsGrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

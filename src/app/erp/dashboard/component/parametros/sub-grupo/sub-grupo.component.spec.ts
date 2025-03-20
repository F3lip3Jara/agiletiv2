import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubGrupoComponent } from './sub-grupo.component';

describe('SubGrupoComponent', () => {
  let component: SubGrupoComponent;
  let fixture: ComponentFixture<SubGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubGrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

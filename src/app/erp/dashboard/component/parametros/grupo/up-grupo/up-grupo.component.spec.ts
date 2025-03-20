import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpGrupoComponent } from './up-grupo.component';

describe('UpGrupoComponent', () => {
  let component: UpGrupoComponent;
  let fixture: ComponentFixture<UpGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpGrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

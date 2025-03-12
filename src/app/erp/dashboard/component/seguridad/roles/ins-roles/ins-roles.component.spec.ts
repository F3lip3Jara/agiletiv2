import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsRolesComponent } from './ins-roles.component';

describe('InsRolesComponent', () => {
  let component: InsRolesComponent;
  let fixture: ComponentFixture<InsRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

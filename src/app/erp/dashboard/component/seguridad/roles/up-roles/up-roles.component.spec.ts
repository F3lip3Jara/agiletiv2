import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpRolesComponent } from './up-roles.component';

describe('UpRolesComponent', () => {
  let component: UpRolesComponent;
  let fixture: ComponentFixture<UpRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

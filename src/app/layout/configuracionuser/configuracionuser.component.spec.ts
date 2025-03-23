import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionuserComponent } from './configuracionuser.component';

describe('ConfiguracionuserComponent', () => {
  let component: ConfiguracionuserComponent;
  let fixture: ComponentFixture<ConfiguracionuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

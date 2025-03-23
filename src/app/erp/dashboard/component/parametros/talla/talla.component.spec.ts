import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallaComponent } from './talla.component';

describe('TallaComponent', () => {
  let component: TallaComponent;
  let fixture: ComponentFixture<TallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TallaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

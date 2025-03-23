import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsTallaComponent } from './ins-talla.component';

describe('InsTallaComponent', () => {
  let component: InsTallaComponent;
  let fixture: ComponentFixture<InsTallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsTallaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsTallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

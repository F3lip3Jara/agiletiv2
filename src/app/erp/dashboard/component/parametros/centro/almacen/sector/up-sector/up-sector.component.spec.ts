import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpSectorComponent } from './up-sector.component';

describe('UpSectorComponent', () => {
  let component: UpSectorComponent;
  let fixture: ComponentFixture<UpSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpSectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

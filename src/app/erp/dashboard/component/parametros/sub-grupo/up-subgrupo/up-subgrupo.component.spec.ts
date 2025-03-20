import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpSubgrupoComponent } from './up-subgrupo.component';

describe('UpSubgrupoComponent', () => {
  let component: UpSubgrupoComponent;
  let fixture: ComponentFixture<UpSubgrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpSubgrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpSubgrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfermeroComponent } from './enfermero.component';

describe('EnfermeroComponent', () => {
  let component: EnfermeroComponent;
  let fixture: ComponentFixture<EnfermeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfermeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnfermeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

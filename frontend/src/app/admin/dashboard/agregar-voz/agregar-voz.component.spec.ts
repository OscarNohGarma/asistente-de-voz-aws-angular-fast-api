import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarVozComponent } from './agregar-voz.component';

describe('AgregarVozComponent', () => {
  let component: AgregarVozComponent;
  let fixture: ComponentFixture<AgregarVozComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarVozComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarVozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

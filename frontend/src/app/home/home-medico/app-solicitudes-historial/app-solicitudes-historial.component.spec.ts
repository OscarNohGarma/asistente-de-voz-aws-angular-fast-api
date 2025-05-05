import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSolicitudesHistorialComponent } from './app-solicitudes-historial.component';

describe('AppSolicitudesHistorialComponent', () => {
  let component: AppSolicitudesHistorialComponent;
  let fixture: ComponentFixture<AppSolicitudesHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSolicitudesHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSolicitudesHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPacientesListaComponent } from './app-pacientes-lista.component';

describe('AppPacientesListaComponent', () => {
  let component: AppPacientesListaComponent;
  let fixture: ComponentFixture<AppPacientesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPacientesListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPacientesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

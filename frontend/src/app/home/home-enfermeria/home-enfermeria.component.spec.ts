import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEnfermeriaComponent } from './home-enfermeria.component';

describe('HomeEnfermeriaComponent', () => {
  let component: HomeEnfermeriaComponent;
  let fixture: ComponentFixture<HomeEnfermeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEnfermeriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEnfermeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

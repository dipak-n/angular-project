import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContainerEmployeeCard } from './view-container-employee-card';

describe('ViewContainerEmployeeCard', () => {
  let component: ViewContainerEmployeeCard;
  let fixture: ComponentFixture<ViewContainerEmployeeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewContainerEmployeeCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewContainerEmployeeCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

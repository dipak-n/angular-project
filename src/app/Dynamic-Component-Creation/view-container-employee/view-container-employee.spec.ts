import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContainerEmployee } from './view-container-employee';

describe('ViewContainerEmployee', () => {
  let component: ViewContainerEmployee;
  let fixture: ComponentFixture<ViewContainerEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewContainerEmployee],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewContainerEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

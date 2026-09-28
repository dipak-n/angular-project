import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentChildEmployeePanel } from './content-child-employee-panel';

describe('ContentChildEmployeePanel', () => {
  let component: ContentChildEmployeePanel;
  let fixture: ComponentFixture<ContentChildEmployeePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentChildEmployeePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentChildEmployeePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

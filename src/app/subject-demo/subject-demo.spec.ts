import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectDemo } from './subject-demo';

describe('SubjectDemo', () => {
  let component: SubjectDemo;
  let fixture: ComponentFixture<SubjectDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

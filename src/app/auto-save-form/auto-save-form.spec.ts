import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoSaveFormComponent } from './auto-save-form';

describe('AutoSaveFormComponent', () => {
  let component: AutoSaveFormComponent;
  let fixture: ComponentFixture<AutoSaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoSaveFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoSaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

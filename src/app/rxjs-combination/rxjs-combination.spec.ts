import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RxjsCombination } from './rxjs-combination';

describe('RxjsCombination', () => {
  let component: RxjsCombination;
  let fixture: ComponentFixture<RxjsCombination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RxjsCombination],
    }).compileComponents();

    fixture = TestBed.createComponent(RxjsCombination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

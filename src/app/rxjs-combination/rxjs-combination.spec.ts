import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RxjsCombinationComponent } from './rxjs-combination';

describe('RxjsCombinationComponent', () => {
  let component: RxjsCombinationComponent;
  let fixture: ComponentFixture<RxjsCombinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RxjsCombinationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RxjsCombinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

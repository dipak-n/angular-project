import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RxjsMapDemo } from './rxjs-map-demo';

describe('RxjsMapDemo', () => {
  let component: RxjsMapDemo;
  let fixture: ComponentFixture<RxjsMapDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RxjsMapDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(RxjsMapDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

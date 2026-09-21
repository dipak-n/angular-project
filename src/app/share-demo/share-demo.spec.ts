import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareDemo } from './share-demo';

describe('ShareDemo', () => {
  let component: ShareDemo;
  let fixture: ComponentFixture<ShareDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

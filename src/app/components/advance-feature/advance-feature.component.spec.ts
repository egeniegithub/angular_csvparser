import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFeatureComponent } from './advance-feature.component';

describe('AdvanceFeatureComponent', () => {
  let component: AdvanceFeatureComponent;
  let fixture: ComponentFixture<AdvanceFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

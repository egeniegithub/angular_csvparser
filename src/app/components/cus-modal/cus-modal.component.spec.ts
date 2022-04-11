import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusModalComponent } from './cus-modal.component';

describe('CusModalComponent', () => {
  let component: CusModalComponent;
  let fixture: ComponentFixture<CusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

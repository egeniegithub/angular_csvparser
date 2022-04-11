import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpreadsheetParserComponent } from './spreadsheet-parser.component';

describe('SpreadsheetParserComponent', () => {
  let component: SpreadsheetParserComponent;
  let fixture: ComponentFixture<SpreadsheetParserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpreadsheetParserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpreadsheetParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvdataComponent } from './csvdata.component';

describe('CsvdataComponent', () => {
  let component: CsvdataComponent;
  let fixture: ComponentFixture<CsvdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingTableComponent } from './reading-table.component';

describe('ReadingTableComponent', () => {
  let component: ReadingTableComponent;
  let fixture: ComponentFixture<ReadingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

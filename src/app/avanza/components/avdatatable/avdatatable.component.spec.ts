import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvdatatableComponent } from './avdatatable.component';

describe('AvdatatableComponent', () => {
  let component: AvdatatableComponent;
  let fixture: ComponentFixture<AvdatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvdatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvdatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

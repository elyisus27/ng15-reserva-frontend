import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartDatatableComponent } from './smart-datatable.component';

describe('SmartDatatableComponent', () => {
  let component: SmartDatatableComponent;
  let fixture: ComponentFixture<SmartDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartDatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

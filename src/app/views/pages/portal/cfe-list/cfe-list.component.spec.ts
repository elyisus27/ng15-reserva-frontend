import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfeListComponent } from './cfe-list.component';

describe('CfeListComponent', () => {
  let component: CfeListComponent;
  let fixture: ComponentFixture<CfeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

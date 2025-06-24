import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DboyPage } from './dboy.page';

describe('DboyPage', () => {
  let component: DboyPage;
  let fixture: ComponentFixture<DboyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DboyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

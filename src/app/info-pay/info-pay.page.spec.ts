import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPayPage } from './info-pay.page';

describe('InfoPayPage', () => {
  let component: InfoPayPage;
  let fixture: ComponentFixture<InfoPayPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

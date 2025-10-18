import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementDialog } from './movement-dialog';

describe('MovementDialog', () => {
  let component: MovementDialog;
  let fixture: ComponentFixture<MovementDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdetailsformComponent } from './userdetailsform.component';

describe('UserdetailsformComponent', () => {
  let component: UserdetailsformComponent;
  let fixture: ComponentFixture<UserdetailsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdetailsformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdetailsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

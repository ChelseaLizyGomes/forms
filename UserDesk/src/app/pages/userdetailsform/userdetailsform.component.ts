import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-userdetailsform',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './userdetailsform.component.html',
  styleUrl: './userdetailsform.component.scss',
})
export class UserdetailsformComponent implements OnInit {
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = new FormGroup({
      fname: new FormControl(null, Validators.required),
      lname: new FormControl(null, Validators.required),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\+61 \d{4} \d{3} \d{3}$/),
      ]),
      email: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    });
  }

  get firstName() {
    return this.userForm.get('fname');
  }
  get lastName() {
    return this.userForm.get('lname');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get email() {
    return this.userForm.get('email');
  }
  get address() {
    return this.userForm.get('address');
  }

  submitUserDetails(): void {
    const formData = {
      fname: this.userForm.get('fname')?.value,
      lname: this.userForm.get('lname')?.value,
      phone: this.userForm.get('phone')?.value,
      email: this.userForm.get('email')?.value,
      address: this.userForm.get('address')?.value,
    };
    if (this.userForm.valid) {
      console.log('User details  Submitted Sucessfully', this.userForm.value);
      console.log('User Data is:', formData);
    } else {
      console.log('User details  NOT Submitted !');
    }
  }
}

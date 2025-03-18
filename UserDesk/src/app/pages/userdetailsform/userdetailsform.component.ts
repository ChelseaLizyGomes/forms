import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-userdetailsform',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './userdetailsform.component.html',
  styleUrl: './userdetailsform.component.scss',
})
export class UserdetailsformComponent implements OnInit {
  userForm!: FormGroup;
  private firebaseService = inject(FirebaseService);

  ngOnInit(): void {
    this.userForm = new FormGroup({
      fname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      lname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\+61\s?\d{4}\s?\d{3}\s?\d{3}$/),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
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

  async submitUserDetails(): Promise<void> {
    if (this.userForm.valid) {
      await this.firebaseService.addUser(this.userForm.value);

      this.userForm.reset();
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.setErrors(null);
      });
    } else {
      console.log('User details NOT submitted!');
    }
  }
}

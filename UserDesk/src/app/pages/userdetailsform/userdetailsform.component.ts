import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../models/users';
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
  users: User[] = [];
  private firebaseService = inject(FirebaseService);

  ngOnInit(): void {
    this.userForm = new FormGroup({
      fname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^(?!.*\bgoogle\b).+$/i),
      ]),
      lname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      // phone: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern(/^\+61\s?\d{4}\s?\d{3}\s?\d{3}$/),
      // ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^0\d*[A-Za-z]?\d*$/),
      ]),
      // email: new FormControl(null, [Validators.required, Validators.email]),
      email: new FormControl(null, [
        Validators.required,
        // Validators.pattern(/^(?!.*\bgmail\b).+$/i),
      ]),

      address: new FormControl(null, Validators.required),
    });

    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.users = await this.firebaseService.getUsers();
    console.log('Users array in Angular:', this.users);
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
      const newUser: User = {
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        phone: this.phone?.value,
        email: this.email?.value,
        address: this.address?.value,
      };
      // await this.firebaseService.addUser(this.userForm.value);
      await this.firebaseService.addUser(newUser);
      this.loadUsers(); // Refresh user list

      this.userForm.reset();
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.setErrors(null);
      });
    } else {
      console.log('User details NOT submitted!');
    }
  }

  // Delete a user
  async deleteUser(index: number) {
    const userToDelete = this.users[index];
    await this.firebaseService.deleteUser(userToDelete.id!);
    this.loadUsers();
  }

  async deleteAllUsers(): Promise<void> {
    if (
      confirm(
        'Are you sure you want to delete all users? This action cannot be undone.'
      )
    ) {
      this.users = []; // Clear local array
      await this.firebaseService.deleteAllUsers(); // Clear Firebase
    }
  }

  updateEmail(user: User) {
    const newEmail = 'edited@hotmail.com';
    this.firebaseService
      .updateUserEmail(user.id!, newEmail)
      .then(() => {
        console.log('Email updated successfully');
        this.loadUsers(); // Refresh list after update
      })
      .catch((error) => console.error('Error updating email:', error));
  }

  // updateUserDetails(user: User) {
  //   const updatedFields = {
  //     firstName: 'John',
  //     phone: '0876543210',
  //   };

  //   this.firebaseService
  //     .updateMultipleFields(user.id!, updatedFields)
  //     .then(() => {
  //       console.log('User details updated successfully');
  //       this.loadUsers(); // Refresh list
  //     })
  //     .catch((error) => console.error('Error updating user details:', error));
  // }
}

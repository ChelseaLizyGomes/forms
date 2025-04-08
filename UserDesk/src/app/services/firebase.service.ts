import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/users';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firestore = inject(Firestore);
  private users: User[] = []; // Local array for storing user data

  // Add user locally first, then save to Firebase
  async addUser(data: User): Promise<void> {
    try {
      console.log('inside service');
      const usersCollection = collection(this.firestore, 'users');
      await addDoc(usersCollection, data);
      console.log('User data saved to Firebase!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const snapshot = await getDocs(usersCollection);

      let users: User[] = snapshot.docs.map((doc) => {
        const id = doc.id;

        const user = {
          id: id,
          ...doc.data(),
        };
        return user as User;
      });

      // Sort users so newest appear first (assuming 'id' is sequential)
      users = users.sort((a, b) => (b.id! > a.id! ? 1 : -1));

      console.log('Fetched and sorted users:', users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Fetch users from Firebase (if needed)
  getUsersFromFirebase(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' }) as Observable<
      User[]
    >;
  }

  // Update user in both local array and Firebase
  async updateUser(id: string, updatedUser: Partial<User>): Promise<void> {
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ...updatedUser } : user
    );
    const userDocRef = doc(this.firestore, 'users', id);
    await updateDoc(userDocRef, updatedUser);
  }

  // Delete user locally and from Firebase
  async deleteUser(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
    const userDocRef = doc(this.firestore, 'users', id);
    await deleteDoc(userDocRef);
  }

  async deleteAllUsers(): Promise<void> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const snapshot = await getDocs(usersCollection);
      const deletePromises = snapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(this.firestore, 'users', docSnapshot.id))
      );

      await Promise.all(deletePromises);
      console.log('All user records deleted successfully!');
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  }

  async updateUserEmail(userId: string, newEmail: string): Promise<void> {
    // Update the user in the local array first
    this.users = this.users.map((user) =>
      user.id === userId ? { ...user, email: newEmail } : user
    );

    // Then update it in Firebase
    const userDocRef = doc(this.firestore, 'users', userId);
    await updateDoc(userDocRef, { email: newEmail });
  }

  // async updateMultipleFields(
  //   userId: string,
  //   updatedFields: Partial<User>
  // ): Promise<void> {
  //   this.users = this.users.map((user) =>
  //     user.id === userId ? { ...user, ...updatedFields } : user
  //   );

  //   const userDocRef = doc(this.firestore, 'users', userId);
  //   await updateDoc(userDocRef, updatedFields);
  // }
}

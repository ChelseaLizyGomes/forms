import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firestore = inject(Firestore);

  async addUser(data: any): Promise<void> {
    try {
      console.log('inside service');
      const usersCollection = collection(this.firestore, 'users');
      await addDoc(usersCollection, data);
      console.log('User data saved to Firebase!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
}

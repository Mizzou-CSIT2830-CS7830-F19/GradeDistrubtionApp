import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'src/types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User>;
  currentAuth: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.afAuth.auth.setPersistence('session');
    this.currentAuth = this.afAuth.authState;
    this.currentUser = this.currentAuth.pipe(
      switchMap((cred: firebase.User | null) => {
        if (cred) {
          return this.afs.doc<User>(`users/${cred.uid}`).valueChanges();
        } else {
          return of(undefined);
        }
      }),
      map(userDetails => userDetails as User)
    );
  }

  async signUp(email: string, password: string, first: string) {
    try {
      const cred = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      const newUser: User = {
        first,
        email,
        uid: cred.user.uid
      };
      this.afs.doc<User>(`users/${cred.user.uid}`).set(newUser);
    } catch (err) {
      throw new Error('Could not create account');
    }
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      throw new Error('Could not login');
    }
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }
}

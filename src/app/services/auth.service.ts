import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line:variable-name
  private _user: firebase.User;
  readonly localStorageUserKey = 'user';
  constructor(private fireAuth: AngularFireAuth, private router: Router) {
    this.getUser();
  }

  private getUser(): void {
    this._user = JSON.parse(localStorage.getItem(this.localStorageUserKey));
    this.fireAuth.user.subscribe(user => {
      this._user = user;
    });
  }

  login(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((user) => {
          localStorage.setItem(this.localStorageUserKey, JSON.stringify(user.user));
          resolve();
        }).catch(err => {
          reject(err);
        });
    });
  }

  get user(): firebase.User {
    return this._user;
  }

  logout(): void {
    this.fireAuth.signOut().then(() => {
      localStorage.removeItem(this.localStorageUserKey);
      this.router.navigate(['/']);
    });
  }
}

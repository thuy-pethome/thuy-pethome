import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { from, Observable, of } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Role } from './role.enum';
import { UserModel } from './entitys/user.model';
import { defaultAvatar } from './constant';
import { IFireStoreService } from './i-fire-store.service';
const TABLE = 'users';
@Injectable({
  providedIn: 'root'
})

export class AuthService extends IFireStoreService<UserModel>  {
  user$: Observable<UserModel | any>;
  constructor(private afAuth: AngularFireAuth, protected afs: AngularFirestore, private router: Router) {
    super(afs, TABLE);
    // this.afAuth.idTokenResult
    // .pipe(
    //     map(token => <any>token?.claims ?? {admin:false})
    // ).subscribe( k => {
    //   console.log
    // })
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<UserModel>(`users/${user.uid}`).snapshotChanges().pipe(
            map( doc => {
              if (doc.payload.exists) {
                const data = doc.payload.data() as UserModel;
                const payloadId = doc.payload.id;
                return { id: payloadId, ...data };
              } else {
                 this.signOut().then( () => {
                  window.location.reload();
                 });
              }
            }),
            map(this.toDateObject.bind(this))
          );
        } else {
          return of(null);
        }
      })
    );
  }
  // async googleSignIn(){
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   const credential = await  this.afAuth.signInWithPopup(provider);
  //   return this.updateUserData(credential.user);
  // }
  login(email: string, password: string): Observable<firebase.User> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(map(it => it.user));
  }
  register(userModel: UserModel): Observable<UserModel> {
    return from(this.afAuth
      .createUserWithEmailAndPassword(userModel.email, userModel.password)).pipe(
        switchMap((res: firebase.auth.UserCredential) => {
          const user: firebase.User = res.user;
          const { uid, email } = user;
          delete userModel.password;
          const data = {
            uid,
            email,
            photoURL: defaultAvatar,
            displayName: userModel.displayName,
            emailVerified: false,
            role: Role.CASHIER,
            active: false,
            ...userModel
          } as UserModel;
          const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${user.uid}`);
          return from(userRef.set(data, { merge: true })).pipe(mapTo(data));
        })
      );
  }
  async signOut() {
    await this.afAuth.signOut().then( () => {
         window.location.reload();
       }
     );
  }
}




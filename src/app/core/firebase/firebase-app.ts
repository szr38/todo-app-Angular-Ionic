import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

import { environment } from '../../../environments/environment';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function initializeFirebaseApp() {
  if (!app) {
    app = initializeApp(environment.firebase);
  }
  return app;
}

export function getFirebaseFirestore() {
  if (!db) {
    db = getFirestore(initializeFirebaseApp());
  }
  return db;
}

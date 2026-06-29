import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Check if all essential keys exist
export const isFirebaseConfigured = !!(
  firebaseConfig &&
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
);

let app;
let auth: any;
let db: any;
let storage: any;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // Use the specific firestore database ID
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    storage = getStorage(app);
  } catch (error) {
    console.error('Error initializing real Firebase app:', error);
  }
}

export { app, auth, db, storage };

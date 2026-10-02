import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'posts', 'why-your-loan-balance-can-still-be-high-after-years-of-emis'));
    console.log('[Firestore] Successfully connected to Google Cloud Firestore!');
  } catch (error: any) {
    if (error && error.message && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration.');
    } else {
      console.log('[Firestore] Connection verified:', error?.code || error?.message);
    }
  }
}

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection() {
  const testPath = 'posts/why-your-loan-balance-can-still-be-high-after-years-of-emis';
  try {
    await getDocFromServer(doc(db, 'posts', 'why-your-loan-balance-can-still-be-high-after-years-of-emis'));
    console.log('[Firestore] Successfully connected to Google Cloud Firestore!');
  } catch (error: any) {
    if (error && error.message && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration.');
    } else if (error && error.message && (error.message.includes('permission') || error.code === 'permission-denied')) {
      handleFirestoreError(error, OperationType.GET, testPath);
    } else {
      console.log('[Firestore] Connection verified:', error?.code || error?.message);
    }
  }
}

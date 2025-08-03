'use client';

// This file is kept for potential future use with other Firebase services.
// The authentication has been migrated to NextAuth.js.

import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = !!firebaseConfig.apiKey;

const app = isFirebaseConfigured && !getApps().length ? initializeApp(firebaseConfig) : (isFirebaseConfigured ? getApp() : null);

export { isFirebaseConfigured, app };

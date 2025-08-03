'use client';

import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, signInWithPopup, GithubAuthProvider, onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';

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
const auth = app ? getAuth(app) : null;
const githubProvider = app ? new GithubAuthProvider() : null;

const signInWithGithub = () => {
    if (!auth || !githubProvider) {
        console.error('Firebase is not configured. Please add Firebase config to your .env file.');
        return Promise.reject(new Error('Firebase not configured'));
    }
    return signInWithPopup(auth, githubProvider);
}

const signOut = () => {
    if (!auth) {
        console.error('Firebase is not configured.');
        return Promise.reject(new Error('Firebase not configured'));
    }
    return firebaseSignOut(auth);
}

export { auth, onAuthStateChanged, signInWithGithub, signOut, type User, isFirebaseConfigured };

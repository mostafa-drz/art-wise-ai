'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getServices } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import * as db from '../utils/db';
import { User } from '../types';
import { User as FireStoreUser } from 'firebase/auth';

// Define the Auth Context Type
interface AuthContextType {
  user: User | FireStoreUser | null;
  loading: boolean;
  sendSignInEmail: (email: string) => Promise<void>;
  handleSignInWithEmailLink: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provide the Auth Context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | FireStoreUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Use `getServices` to access Firebase services
  const firebaseServices = getServices();
  const auth = firebaseServices?.auth;

  useEffect(() => {
    if (!auth) return;
    // Monitor auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const sendSignInEmail = async (email: string): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/callback`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert('A sign-in link has been sent to your email.');
    } catch (error: any) {
      console.error('Error sending sign-in email:', error.message);
      throw new Error(error.message);
    }
  };

  const handleSignInWithEmailLink = async (): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    try {
      const email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        throw new Error('No email found. Please re-enter your email address.');
      }

      if (isSignInWithEmailLink(auth, window.location.href)) {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        const userId = result.user.uid;
        const dbUser = await db.getUser(userId);
        if (!dbUser) {
          await db.createUser(result.user as User);
        }
        setUser(result.user);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (error: any) {
      console.error('Error signing in with email link:', error.message);
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    const userId = user.uid;
    const usersCollection = db.getUsersCollection();
    const userDoc = doc(usersCollection, userId);
    const unsubscribe = onSnapshot(userDoc, (doc: any) => {
      if (doc.exists()) {
        const userData = doc.data() as User;
        setUser((currentData) => ({ ...currentData, ...userData }));
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const logout = async (): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      throw new Error(error.message);
    }
  };

  if (!auth) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, sendSignInEmail, handleSignInWithEmailLink, logout }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

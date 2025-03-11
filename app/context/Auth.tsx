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
import { doc, onSnapshot, DocumentSnapshot } from 'firebase/firestore';
import * as db from '../utils/db';
import { User } from '../types';

// Define the Auth Context Type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendSignInEmail: (email: string) => Promise<void>;
  handleSignInWithEmailLink: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rate limiting for auth operations
const RATE_LIMIT_WINDOW = 1000 * 60 * 15; // 15 minutes
const MAX_SIGNIN_ATTEMPTS = 5;

interface RateLimit {
  attempts: number;
  windowStart: number;
}

const rateLimits = new Map<string, RateLimit>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(identifier);

  if (!limit) {
    rateLimits.set(identifier, { attempts: 1, windowStart: now });
    return true;
  }

  if (now - limit.windowStart > RATE_LIMIT_WINDOW) {
    rateLimits.set(identifier, { attempts: 1, windowStart: now });
    return true;
  }

  if (limit.attempts >= MAX_SIGNIN_ATTEMPTS) {
    return false;
  }

  limit.attempts += 1;
  rateLimits.set(identifier, limit);
  return true;
}

// Provide the Auth Context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Use `getServices` to access Firebase services
  const firebaseServices = getServices();
  const auth = firebaseServices?.auth;

  useEffect(() => {
    if (!auth) return;

    // Monitor auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync user with database
          const syncedUser = await db.syncUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
          setUser(syncedUser);
        } catch (error) {
          console.error('Error syncing user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const sendSignInEmail = async (email: string): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }

    // Check rate limit
    if (!checkRateLimit(email)) {
      throw new Error('Too many sign-in attempts. Please try again in 15 minutes.');
    }

    const actionCodeSettings = {
      url: `${window.location.origin}/auth/callback`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert('A sign-in link has been sent to your email.');
    } catch (error: unknown) {
      console.error('Error sending sign-in email:', error);
      throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
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
        const syncedUser = await db.syncUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
        setUser(syncedUser);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (error: unknown) {
      console.error('Error signing in with email link:', error);
      throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    if (!user?.uid) return;

    const userId = user.uid;
    const usersCollection = db.getUsersCollection();
    const userDoc = doc(usersCollection, userId);

    const unsubscribe = onSnapshot(
      userDoc,
      (docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUser((currentData) => ({ ...currentData, ...userData }) as User);
        }
      },
      (error: unknown) => {
        console.error('Error listening to user document:', error);
      },
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const logout = async (): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: unknown) {
      console.error('Error signing out:', error);
      throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
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

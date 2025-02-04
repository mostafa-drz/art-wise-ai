import { getServices } from './firebase';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { User } from '../types';
import { FREE_INCLUDED_CREDITS_FOR_USER } from '.';

export const getUsersCollection = () => {
  const services = getServices();
  const db = services?.db || getFirestore();
  const usersCollection = collection(db, 'users');
  return usersCollection;
};

export const createUser = async (
  user: Omit<User, 'availableCredits' | 'usedCredits'>,
): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    await setDoc(doc(usersCollection, user.uid), {
      ...user,
      availableCredits: FREE_INCLUDED_CREDITS_FOR_USER,
      usedCredits: 0,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const getUser = async (id: string): Promise<User | null> => {
  try {
    const usersCollection = getUsersCollection();
    const docRef = doc(usersCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to get user');
  }
};

export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    const docRef = doc(usersCollection, id);
    await updateDoc(docRef, user);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    const docRef = doc(usersCollection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};

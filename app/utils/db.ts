import { getServices } from './firebase';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { User, UserData } from '../types';
import { FREE_INCLUDED_CREDITS } from '@/utils/helpers';

export const getUsersCollection = () => {
  const services = getServices();
  const db = services?.db || getFirestore();
  const usersCollection = collection(db, 'users');
  return usersCollection;
};

type TimestampObject = {
  [K in keyof DocumentData]: DocumentData[K] extends Timestamp
    ? string
    : DocumentData[K] extends object
      ? TimestampObject
      : DocumentData[K];
};

// Helper function to convert Timestamp to ISO string with proper typing
const convertTimestamps = <T extends DocumentData>(data: T): TimestampObject => {
  if (data instanceof Timestamp) {
    return data.toDate().toISOString() as unknown as TimestampObject;
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertTimestamps(item)) as unknown as TimestampObject;
  }

  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce(
      (result, [key, value]) => ({
        ...result,
        [key]: convertTimestamps(value),
      }),
      {} as TimestampObject,
    );
  }

  return data as TimestampObject;
};

interface AuthUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

type NewUserData = Omit<UserData, 'updatedAt'> & {
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
};

type UserUpdate = Partial<UserData> & {
  lastLoginAt: Timestamp;
  updatedAt: Timestamp;
};

export const syncUser = async (authData: AuthUserData): Promise<User> => {
  try {
    const usersCollection = getUsersCollection();
    const userRef = doc(usersCollection, authData.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user with default values
      const newUserData: NewUserData = {
        ...authData,
        availableCredits: FREE_INCLUDED_CREDITS,
        usedCredits: 0,
        createdAt: serverTimestamp() as Timestamp,
        lastLoginAt: serverTimestamp() as Timestamp,
      };

      await setDoc(userRef, newUserData);
      const createdDoc = await getDoc(userRef);
      const convertedData = convertTimestamps(createdDoc.data() as DocumentData);
      return { ...authData, ...convertedData } as User;
    } else {
      const updateData: UserUpdate = {
        lastLoginAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      await updateDoc(userRef, updateData);
      // Get updated doc after update to ensure server timestamps are resolved
      const updatedDoc = await getDoc(userRef);
      const convertedUpdated = convertTimestamps(updatedDoc.data() as DocumentData);

      return {
        ...convertedUpdated,
        ...authData,
      } as User;
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    throw new Error('Failed to sync user');
  }
};

export const createUser = async (authUser: AuthUserData): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    const userData: NewUserData = {
      ...authUser,
      availableCredits: FREE_INCLUDED_CREDITS,
      usedCredits: 0,
      createdAt: serverTimestamp() as Timestamp,
      lastLoginAt: serverTimestamp() as Timestamp,
    };

    await setDoc(doc(usersCollection, authUser.uid), userData);
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
      const data = docSnap.data();
      const convertedData = convertTimestamps(data);
      return convertedData as User;
    }

    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to get user');
  }
};

export const updateUser = async (id: string, userData: Partial<UserData>): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    const docRef = doc(usersCollection, id);
    const updateData: Partial<UserUpdate> = {
      ...userData,
      updatedAt: serverTimestamp() as Timestamp,
    };

    await updateDoc(docRef, updateData);
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

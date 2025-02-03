import { getServices } from './firebase';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from 'firebase/firestore';
import { RealtimeSession } from '../context/OpenAIRealtimeWebRTC/types';
import { User } from '../types';

const getUsersCollection = () => {
  const services = getServices();
  const db = services?.db || getFirestore();
  const usersCollection = collection(db, 'users');
  return usersCollection;
};

export const createUser = async (user: User): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    await setDoc(doc(usersCollection, user.id), user);
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

export const createSession = async (userId: string, session: RealtimeSession): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      sessions: arrayUnion(session),
    });
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
};

export const getSession = async (
  userId: string,
  sessionId: string,
): Promise<RealtimeSession | null> => {
  try {
    const user = await getUser(userId);
    if (user) {
      return user.sessions?.find((session) => session.id === sessionId) || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting session:', error);
    throw new Error('Failed to get session');
  }
};

export const updateSession = async (
  userId: string,
  sessionId: string,
  session: Partial<RealtimeSession>,
): Promise<void> => {
  try {
    const user = await getUser(userId);
    const usersCollection = getUsersCollection();
    if (user) {
      const updatedSessions = user.sessions?.map((s) =>
        s.id === sessionId ? { ...s, ...session } : s,
      );
      const userRef = doc(usersCollection, userId);
      await updateDoc(userRef, { sessions: updatedSessions });
    }
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error('Failed to update session');
  }
};

export const deleteSession = async (userId: string, sessionId: string): Promise<void> => {
  try {
    const user = await getUser(userId);
    const usersCollection = getUsersCollection();
    if (user) {
      const updatedSessions = user.sessions?.filter((s) => s.id !== sessionId);
      const userRef = doc(usersCollection, userId);
      await updateDoc(userRef, { sessions: updatedSessions });
    }
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error('Failed to delete session');
  }
};

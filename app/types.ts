import { RealtimeSession } from './context/OpenAIRealtimeWebRTC/types';
import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
export interface Input {
  language?: string; // optional field, it mentions the default language for response and further inputs, if not provided en-US, the language is in standard formats
}

export interface RecommendedArt {
  art_title: string;
  artist_name: string;
  date: string;
  image_url: string;
  link: string;
}

export interface Output {
  art_title: string; // the title of the art work
  artist_name: string; // the name of the artist
  date: string; // date the art is created
  more_about_artist: string; // a brief about artist, to show as complimentary data
  brief_history: string; // a brief history, importance and why it's famous, what's important about it
  technical_details: string; // from art point of view, what are some details? What details the audience should pay attention to, and why?
  other_facts: string; // any fun cats, social or historical facts about it
  originalImageURL: string; // the original image URL
  recommended: RecommendedArt[];
  imageURL?: string; // the image URL
}

export interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface RequestFormData extends Input {
  image?: File;
}

export enum VoiceGender {
  NEUTRAL = 'NEUTRAL',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ChatMode {
  VOICE = 'voice',
  TEXT = 'text',
}

// Base interface for user data stored in Firestore
export interface UserData {
  availableCredits: number;
  usedCredits: number;
  sessions?: RealtimeSession[];
  isBlocked?: boolean;
  lastTransactionAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
}

// Combined interface for both Firebase Auth and our custom fields
export interface User extends FirebaseUser, UserData {}

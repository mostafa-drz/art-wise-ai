import { updateUser } from './db';
import { User } from '../types';

export enum GenAiType {
  newSearch = 'newSearch',
  generateAudioVersion = 'generateAudioVersion',
  textConversation = 'textConversation',
  liveAudioConversation = 'liveAudioConversation',
}

export const FREE_INCLUDED_CREDITS_FOR_USER = 1000;
export const GEN_AI_COST = {
  [GenAiType.newSearch]: 1,
  [GenAiType.generateAudioVersion]: 3,
  [GenAiType.textConversation]: 2,
  [GenAiType.liveAudioConversation]: 4,
};

export function handleChargeUser(user: User, transactionType: GenAiType) {
  const cost = GEN_AI_COST[transactionType];
  user.availableCredits = (user.availableCredits as number) - cost;
  user.usedCredits = (user.usedCredits as number) + cost;
  updateUser(user.uid, { availableCredits: user.availableCredits, usedCredits: user.usedCredits });
}

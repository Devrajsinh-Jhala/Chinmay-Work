import type { Question } from './types';

const CHANNEL_NAME = 'quiz-app-state';

export type ChannelMessage = {
  type: 'state_update';
  payload: Question[];
};

let channel: BroadcastChannel | null = null;

export const getQuizChannel = (): BroadcastChannel => {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
  return channel;
};

export const postStateUpdate = (questions: Question[]) => {
  const message: ChannelMessage = {
    type: 'state_update',
    payload: questions,
  };
  getQuizChannel().postMessage(message);
};

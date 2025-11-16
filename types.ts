export type AnswerOption = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: number;
  answer: AnswerOption[];
}

export type ChannelMessage = {
  type: 'state_update';
  payload: Question[];
};

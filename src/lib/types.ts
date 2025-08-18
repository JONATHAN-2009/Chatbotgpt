export type Message = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  url?: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

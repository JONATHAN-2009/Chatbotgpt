import { ChatPageClient } from './chat-page-client';

export default function ChatPage({ params }: { params: { chatId?: string[] } }) {
  const chatId = params.chatId?.[0];

  return <ChatPageClient chatId={chatId} />;
}

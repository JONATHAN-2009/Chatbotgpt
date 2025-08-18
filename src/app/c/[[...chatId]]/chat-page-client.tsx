
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Conversation, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Search, SquarePen, History, Compass, Star, MoreHorizontal, X, Send } from 'lucide-react';
import { nanoid } from 'nanoid';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput, ChatInputSubmit, ChatInputTextArea } from "@/components/ui/chat-input";

const NewLogo = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12H8.01M12 12H12.01M16 12H16.01M21.364 10.182C21.7542 10.9334 22 11.7543 22 12.6061C22 16.9912 17.9653 20.6061 12.8788 20.6061C12.592 20.6061 12.3082 20.5912 12.0274 20.562C6.98285 20.218 3 16.0157 3 11.6364C3 7.82843 5.92893 4.63636 9.5 4.63636C10.1919 4.63636 10.864 4.72322 11.5 4.88182"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 1.5C19.433 1.5 21 3.067 21 5C21 6.933 19.433 8.5 17.5 8.5C15.567 8.5 14 6.933 14 5C14 3.067 15.567 1.5 17.5 1.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
);


const Sidebar = () => {
    const GrokIconSidebar = () => (
        <svg width="24" height="24" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M368 256l-50.28 50.28L368 356.57l-50.28 50.28L267.43 356.57l-50.28 50.28L166.86 356.57 116.57 406.85l-50.28-50.28L116.57 306.28l-50.28-50.28L116.57 205.71l-50.28-50.28L116.57 105.14l50.29-50.28L217.14 105.14l50.29-50.28 50.28 50.28L267.43 155.43l50.28-50.29 50.28 50.29-50.28 50.28 50.28 50.29zm-112.57 0l50.28-50.29-50.28-50.28-50.29 50.28zm-50.28 50.28l50.28 50.29 50.29-50.29-50.29-50.28z"/></svg>
    )

    const BoxIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H19C19.5304 18 20.0391 17.7893 20.4142 17.4142C20.7893 17.0391 21 16.5304 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.27002 6.9602L12 12.0002L20.73 6.9602" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    const SoundWaveIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    return (
        <aside className="w-14 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4 text-gray-600">
            <GrokIconSidebar />
            <Button variant="ghost" size="icon" className="text-black h-8 w-8"><Search className="size-5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><SquarePen className="size-5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><SoundWaveIcon /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><BoxIcon /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Compass className="size-5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><History className="size-5" /></Button>
            <div className="flex-grow" />
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs">C</Button>
            <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                <Send className="size-4 rotate-90" />
            </Button>
        </aside>
    )
}

const ChatArea = ({ activeConversation, input, setInput, handleSendMessage, isLoading }: { activeConversation: Conversation | null, input: string, setInput: (val: string) => void, handleSendMessage: () => void, isLoading: boolean }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto space-y-8">
                {activeConversation?.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </main>
        <footer className="p-4 bg-gray-50/80 backdrop-blur-md">
            <div className="w-full max-w-5xl mx-auto">
                <ChatInput
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onSubmit={handleSendMessage}
                    loading={isLoading}
                    onStop={() => setIsLoading(false)}
                >
                    <ChatInputTextArea placeholder="Comment Grok peut-il aider ?" />
                    <ChatInputSubmit />
                </ChatInput>
            </div>
        </footer>
      </div>
  );
}

export function ChatPageClient({ chatId }: { chatId?: string }) {
  const router = useRouter();
  
  const { toast } = useToast();

  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [input, setInput] = React.useState('');

  const handleNewChat = React.useCallback(() => {
    const newId = nanoid();
    if (!conversations.some(c => c.id === newId)) {
        const newConversation: Conversation = { id: newId, title: `Chat ${newId.substring(0,4)}`, messages: [] };
        setConversations(prev => [...prev, newConversation]);
        setActiveConversationId(newId);
    }
    router.push(`/c/${newId}`);
  }, [router, conversations]);

  React.useEffect(() => {
    if (chatId) {
      if (!conversations.some(c => c.id === chatId)) {
        const newConversation: Conversation = { id: chatId, title: `Chat ${chatId.substring(0,4)}`, messages: [] };
        setConversations(prev => [...prev, newConversation]);
      }
      setActiveConversationId(chatId);
    } else if (!activeConversationId && conversations.length === 0) {
      handleNewChat();
    }
  }, [chatId, conversations, activeConversationId, handleNewChat]);
  
  const activeConversation = React.useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) ?? null;
  }, [conversations, activeConversationId]);


  const handleSendMessage = async () => {
    if (!input.trim() || !activeConversationId) return;

    const userInput: Message = { role: 'user', content: input, id: nanoid() };
    const currentConversation = conversations.find(c => c.id === activeConversationId);
    
    if (!currentConversation) return;
    
    const isFirstMessage = currentConversation.messages.length === 0;

    const updatedMessages = [...currentConversation.messages, userInput];
    const updatedConversation = { ...currentConversation, messages: updatedMessages };

    setConversations(conversations.map(c => c.id === activeConversationId ? updatedConversation : c));
    setInput('');
    setIsLoading(true);
    
    const assistantPlaceholder: Message = { role: 'assistant', content: '', id: nanoid() };
    setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, messages: [...updatedMessages, assistantPlaceholder] } : c));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.map(({role, content}) => ({role, content})) }),
      });

      if (!res.body) {
        throw new Error('Response body is null');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        let boundary = buffer.indexOf('\n\n');
        while(boundary !== -1) {
            const chunkString = buffer.substring(0, boundary);
            buffer = buffer.substring(boundary + 2);

            if (chunkString.startsWith('data: ')) {
                const jsonStr = chunkString.substring(6);
                if (jsonStr.trim() === '[DONE]') {
                    break;
                }
                if (jsonStr) {
                    try {
                        const chunk = JSON.parse(jsonStr);
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            fullResponse += content;
                            setConversations(prev =>
                                prev.map(c =>
                                    c.id === activeConversationId
                                        ? { ...c, messages: c.messages.map(m => m.id === assistantPlaceholder.id ? { ...m, content: fullResponse } : m) }
                                        : c
                                )
                            );
                        }
                    } catch (error) {
                        console.error("Failed to parse chunk:", jsonStr, error);
                    }
                }
            }
             boundary = buffer.indexOf('\n\n');
        }
      }
      
      const finalAssistantMessage: Message = { role: 'assistant', content: fullResponse, id: assistantPlaceholder.id };
      
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: c.messages.map(m => m.id === assistantPlaceholder.id ? finalAssistantMessage : m) }
            : c
        )
      );
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to get response from AI. Please check your API key and try again. ${error instanceof Error ? error.message : ''}`,
      });
      setConversations(prev => prev.map(c => c.id === activeConversationId ? {...c, messages: c.messages.filter(m => m.id !== assistantPlaceholder.id)} : c));
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  if (!hasMessages) {
     return (
        <div className="flex h-screen bg-[#F9F9F9] text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="flex-grow flex flex-col items-center justify-center text-center gap-4">
                        <NewLogo className="w-12 h-12 text-black"/>
                        <h1 className="text-2xl font-bold">Comment puis-je vous aider aujourd'hui ?</h1>
                    </div>
                    <div className="w-full max-w-3xl p-4">
                      <ChatInput
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onSubmit={handleSendMessage}
                          loading={isLoading}
                          onStop={() => setIsLoading(false)}
                      >
                          <ChatInputTextArea placeholder="Comment Grok peut-il aider ?" />
                          <ChatInputSubmit />
                      </ChatInput>
                    </div>
                </main>
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F9F9] text-foreground">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <ChatArea
          activeConversation={activeConversation}
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

    

    


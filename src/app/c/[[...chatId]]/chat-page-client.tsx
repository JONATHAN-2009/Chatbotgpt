
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

const GrokLogo = ({ className }: { className?: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.6304 15.2065C16.4449 15.392 16.1884 15.4999 15.9234 15.4999C15.6583 15.4999 15.4018 15.392 15.2163 15.2065L12.4887 12.4846L9.77836 15.1957C9.59286 15.3812 9.33636 15.4891 9.07136 15.4891C8.80636 15.4891 8.54986 15.3812 8.36436 15.1957C7.99336 14.8247 7.99336 14.2247 8.36436 13.8537L11.0754 11.1427L8.36436 8.43164C7.99336 8.06064 7.99336 7.46064 8.36436 7.08964C8.73536 6.71864 9.33536 6.71864 9.70636 7.08964L12.4174 9.80064L15.2163 7.0015C15.5873 6.6305 16.1873 6.6305 16.5583 7.0015C16.9293 7.3725 16.9293 7.9725 16.5583 8.3435L13.7594 11.1427L16.6304 13.9395C17.0014 14.3105 17.0014 14.8355 16.6304 15.2065Z" fill="currentColor"/>
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

      if (isFirstMessage) {
        const summarizeRes = await fetch('/api/chat/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatHistory: `User: ${input}\nAssistant: ${fullResponse}` }),
        });
        if(summarizeRes.ok) {
            const summaryData = await summarizeRes.json();
            setConversations(prev =>
                prev.map(c => c.id === activeConversationId ? { ...c, title: summaryData.summary } : c)
            );
        } else {
            console.error("Failed to summarize chat");
        }
      }

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
                        <GrokLogo className="w-12 h-12 text-black"/>
                        <h1 className="text-2xl font-bold">Comment puis-je vous aider aujourd'hui ?</h1>
                    </div>
                    <div className="w-full max-w-5xl p-4">
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
        <header className="p-2 flex justify-between items-center border-b border-gray-200 h-14">
            <span className="font-bold px-2">{activeConversation?.title}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><SquarePen className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Star className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="size-4" /></Button>
          </div>
        </header>
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

    

    
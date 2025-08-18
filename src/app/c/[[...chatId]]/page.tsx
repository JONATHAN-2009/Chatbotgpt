
'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Conversation, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Bot, Paperclip, Rocket, Send, User, Users, FileText, ChevronDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/chat-message';
import { EmptyScreen } from '@/components/empty-screen';
import { nanoid } from 'nanoid';

const GrokIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-12">
        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.63 15.207C16.444 15.392 16.188 15.5 15.923 15.5C15.658 15.5 15.402 15.392 15.216 15.207L12.489 12.485L9.778 15.196C9.592 15.381 9.336 15.489 9.071 15.489C8.806 15.489 8.55 15.381 8.364 15.196C7.993 14.825 7.993 14.225 8.364 13.854L11.075 11.143L8.364 8.432C7.993 8.061 7.993 7.461 8.364 7.09C8.735 6.719 9.335 6.719 9.706 7.09L12.417 9.801L15.216 7.002C15.587 6.631 16.187 6.631 16.558 7.002C16.929 7.373 16.929 7.973 16.558 8.344L13.759 11.143L16.63 13.94C17.001 14.311 17.001 14.836 16.63 15.207Z" fill="currentColor"/>
    </svg>
);


const SoundWaveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 10V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function ChatPage({ params }: { params: { chatId?: string[] } }) {
  const chatId = params.chatId?.[0];
  const router = useRouter();
  const pathname = usePathname();
  
  const { toast } = useToast();

  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(chatId ?? null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [input, setInput] = React.useState('');

  const handleNewChat = React.useCallback(() => {
    const newId = nanoid();
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
    };
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newId);
    router.push(`/c/${newId}`);
  }, [router]);

  React.useEffect(() => {
    if (chatId && !conversations.some(c => c.id === chatId)) {
        if (chatId === 'new') {
            handleNewChat();
        } else {
            const newConversation: Conversation = { id: chatId, title: `Chat ${chatId.substring(0, 4)}`, messages: [] };
            setConversations(prev => [...prev, newConversation]);
            setActiveConversationId(chatId);
        }
    } else if (!chatId && conversations.length === 0) {
        handleNewChat();
    }
  }, [chatId, conversations, handleNewChat]);

  
  const activeConversation = React.useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) ?? null;
  }, [conversations, activeConversationId]);

  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonStr = line.substring(6);
                if (jsonStr === '[DONE]') {
                    break;
                }
                try {
                    const jsonChunk = JSON.parse(jsonStr); 
                    if(jsonChunk.choices && jsonChunk.choices[0].delta.content) {
                        fullResponse += jsonChunk.choices[0].delta.content;
                        setConversations(prev =>
                          prev.map(c =>
                            c.id === activeConversationId
                              ? { ...c, messages: c.messages.map(m => m.id === assistantPlaceholder.id ? { ...m, content: fullResponse } : m) }
                              : c
                          )
                        );
                    }
                } catch (error) {
                    console.error("Failed to parse chunk:", jsonStr);
                }
            }
        }
      }
      
      const finalAssistantMessage: Message = { role: 'assistant', content: fullResponse, id: assistantPlaceholder.id };

      const enhanceRes = await fetch('/api/chat/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input, groqResponse: fullResponse }),
      });

      if (enhanceRes.ok) {
        const enhancedData = await enhanceRes.json();
        finalAssistantMessage.content = enhancedData.enhancedResponse;
        finalAssistantMessage.url = enhancedData.suggestedUrl;
      } else {
        console.error("Failed to enhance response");
      }
      
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
        description: 'Failed to get response from AI. Please check your API key and try again.',
      });
      setConversations(prev => prev.map(c => c.id === activeConversationId ? {...c, messages: c.messages.filter(m => m.id !== assistantPlaceholder.id)} : c));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  
  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  if (hasMessages) {
    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    {activeConversation.messages.map(message => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                </div>
            </main>
            <footer className="p-4 border-t bg-background">
                <div className="max-w-4xl mx-auto">
                    <form ref={formRef} onSubmit={handleSendMessage} className="relative">
                        <Textarea
                          ref={inputRef}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder="Que voulez-vous savoir?"
                          className="w-full bg-background border border-gray-300 rounded-2xl p-4 pr-20"
                          onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  formRef.current?.requestSubmit();
                              }
                          }}
                        />
                         <div className="absolute bottom-3 right-3 flex items-center gap-2">
                             <Button type="submit" size="icon" className="bg-foreground hover:bg-foreground/90 rounded-full" disabled={isLoading || !input.trim()}>
                                <Send className="size-5" />
                            </Button>
                        </div>
                      </form>
                </div>
            </footer>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="p-4 flex justify-end">
            <Button variant="ghost" className="text-muted-foreground">
                <Bot className="mr-2 size-4" />
                Privé
            </Button>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center -mt-20">
            <div className="text-center mb-8">
                <GrokIcon />
                <h1 className="text-4xl font-bold mt-2">Grok</h1>
            </div>
            
            <div className="w-full max-w-2xl px-4">
                 <div className="relative bg-white rounded-2xl shadow-lg p-4">
                    <form ref={formRef} onSubmit={handleSendMessage}>
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Que voulez-vous savoir ?"
                            className="bg-transparent border-none focus:ring-0 resize-none w-full text-lg pr-12 text-black"
                             onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  formRef.current?.requestSubmit();
                              }
                            }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                             <Button type="submit" size="icon" className="bg-black hover:bg-black/80 rounded-full" disabled={isLoading || !input.trim()}>
                                <SoundWaveIcon />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                             <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="text-muted-foreground"><Paperclip className="size-4" /></Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <Rocket className="mr-2 size-4" />
                                    Automatique
                                    <ChevronDown className="ml-1 size-4" />
                                </Button>
                             </div>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button variant="outline" className="rounded-full bg-white text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                            <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM12.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM10 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            <path d="M6 6.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5zm6.5 2.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5zm-6 2.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5z"/>
                        </svg>
                        DeepSearch
                    </Button>
                    <Button variant="outline" className="rounded-full bg-white text-black">
                        <FileText className="mr-2 size-4" />
                        Dernières nouvelles
                    </Button>
                    <Button variant="outline" className="rounded-full bg-white text-black">
                        <Users className="mr-2 size-4" />
                        Modes
                        <ChevronDown className="ml-1 size-4" />
                    </Button>
                </div>
            </div>
        </main>
    </div>
  );
}

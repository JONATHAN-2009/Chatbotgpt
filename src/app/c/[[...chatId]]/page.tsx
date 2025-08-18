
'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Bot, Plus, Send, User, MessageSquare, Settings, Mic, Upload, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/chat-message';
import { EmptyScreen } from '@/components/empty-screen';
import { nanoid } from 'nanoid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';


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

  const onSelectPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
        inputRef.current?.focus();
        formRef.current?.requestSubmit();
    }, 0);
  }

  React.useEffect(() => {
    if (activeConversationId && activeConversationId !== pathname.split('/').pop()) {
      router.push(`/c/${activeConversationId}`);
    }
  }, [activeConversationId, pathname, router]);

  React.useEffect(() => {
    const currentChatId = pathname.split('/').pop();
    if(currentChatId && conversations.find(c => c.id === currentChatId)) {
        setActiveConversationId(currentChatId);
    }
  }, [pathname, conversations]);

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex h-[100svh] bg-background text-foreground">
        <aside className="w-64 flex flex-col p-2 bg-background border-r">
            <div className="flex-1">
                <Button variant="ghost" className="w-full justify-start gap-2 mb-4" onClick={handleNewChat}>
                    <Bot size={20} />
                    New Chat
                    <div className="flex-1" />
                    <MessageSquare size={20} />
                </Button>
                <div className="space-y-1">
                    {conversations.filter(c => c.messages.length > 0).map(c => (
                        <Button key={c.id} variant={c.id === activeConversationId ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveConversationId(c.id)}>
                            {c.title}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="p-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <div className="size-7 rounded-full bg-blue-500 text-white flex items-center justify-center">K</div>
                            <span className="truncate">User</span>
                            <div className='flex-1' />
                            <Settings size={20} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-60">
                        <DropdownMenuItem>My plan</DropdownMenuItem>
                        <DropdownMenuItem>Custom instructions</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden">
            <header className="flex items-center justify-between p-2 border-b h-16">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1">
                      <h1 className="text-lg font-semibold">ChatGPT</h1>
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>ChatGPT</DropdownMenuItem>
                    <DropdownMenuItem>Other Model</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2">
                <Button variant="ghost">
                  <Sparkles className="mr-2" size={16} /> Améliorez votre forfait
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="size-6" />
                </Button>
              </div>
            </header>

            <div className={`flex-1 relative ${!hasMessages ? 'flex flex-col' : ''}`}>
                <ScrollArea className="h-full">
                    <div className="p-4 md:p-6 max-w-4xl mx-auto">
                        {hasMessages ? (
                            <div className="space-y-6">
                            {activeConversation.messages.map(message => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            </div>
                        ) : (
                            <EmptyScreen onSelect={onSelectPrompt}/>
                        )}
                    </div>
                </ScrollArea>

                <div className={`w-full p-4 md:p-6 self-end ${!hasMessages ? 'absolute bottom-0' : 'border-t'}`}>
                    <div className="max-w-4xl mx-auto">
                      <form ref={formRef} onSubmit={handleSendMessage} className="relative">
                        <Textarea
                          ref={inputRef}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder="Posez une question..."
                          className="pr-24 pl-12 min-h-[52px] rounded-2xl border-2 border-border focus:border-primary"
                          onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  formRef.current?.requestSubmit();
                              }
                          }}
                        />
                         <Button type="button" size="icon" variant="ghost" className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Plus className="size-5" />
                        </Button>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button type="button" size="icon" variant="ghost">
                                <Mic className="size-5" />
                            </Button>
                             <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 rounded-lg" disabled={isLoading || !input.trim()}>
                                <Send className="size-5" />
                            </Button>
                        </div>
                      </form>
                      <p className='text-xs text-center text-muted-foreground mt-2'>
                        ChatGPT can make mistakes. Consider checking important information.
                      </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}

    
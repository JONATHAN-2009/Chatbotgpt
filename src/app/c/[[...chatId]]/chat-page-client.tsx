
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Conversation, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Paperclip, Rocket, ChevronDown, Search, SquarePen, History, Settings, Bot, Users, VenetianMask } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/chat-message';
import { nanoid } from 'nanoid';

const GrokLogo = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.6304 15.2065C16.4449 15.392 16.1884 15.4999 15.9234 15.4999C15.6583 15.4999 15.4018 15.392 15.2163 15.2065L12.4887 12.4846L9.77836 15.1957C9.59286 15.3812 9.33636 15.4891 9.07136 15.4891C8.80636 15.4891 8.54986 15.3812 8.36436 15.1957C7.99336 14.8247 7.99336 14.2247 8.36436 13.8537L11.0754 11.1427L8.36436 8.43164C7.99336 8.06064 7.99336 7.46064 8.36436 7.08964C8.73536 6.71864 9.33536 6.71864 9.70636 7.08964L12.4174 9.80064L15.2163 7.0015C15.5873 6.6305 16.1873 6.6305 16.5583 7.0015C16.9293 7.3725 16.9293 7.9725 16.5583 8.3435L13.7594 11.1427L16.6304 13.9395C17.0014 14.3105 17.0014 14.8355 16.6304 15.2065Z" fill="currentColor"/>
    </svg>
);


const ChatInput = ({ input, setInput, handleSendMessage, isLoading }: { input: string, setInput: (val: string) => void, handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void, isLoading: boolean }) => {
    const formRef = React.useRef<HTMLFormElement>(null);

    const MicIcon = () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.8954 2 10 2.89543 10 4V10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10V4C14 2.89543 13.1046 2 12 2Z" fill="currentColor"/>
        <path d="M5 10C5 13.866 8.13401 17 12 17C15.866 17 19 13.866 19 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H5Z" fill="currentColor"/>
        <path d="M12 17V21C12 21.5523 11.5523 22 11 22H13C13.5523 22 14 21.5523 14 21V17H12Z" fill="currentColor"/>
      </svg>
    )

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
             <div className="relative w-full bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
                <form ref={formRef} onSubmit={handleSendMessage}>
                    <Textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Que voulez-vous savoir ?"
                        className="bg-transparent border-none focus:ring-0 resize-none w-full text-lg text-black p-0"
                         onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              formRef.current?.requestSubmit();
                          }
                        }}
                        rows={1}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8"><Paperclip className="size-5" /></Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Rocket className="mr-2 size-4" />
                                Automatique
                                <ChevronDown className="ml-1 size-4" />
                            </Button>
                        </div>
                        <Button type="submit" size="icon" className="bg-black hover:bg-black/80 rounded-full w-10 h-10" disabled={isLoading || !input.trim()}>
                          <MicIcon />
                        </Button>
                    </div>
                </form>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" className="rounded-full bg-gray-100 border-gray-300 text-sm font-normal text-gray-800"><Bot className="mr-2 size-4"/>DeepSearch</Button>
              <Button variant="outline" className="rounded-full bg-gray-100 border-gray-300 text-sm font-normal text-gray-800"><History className="mr-2 size-4"/>Dernières nouvelles</Button>
              <Button variant="outline" className="rounded-full bg-gray-100 border-gray-300 text-sm font-normal text-gray-800"><Users className="mr-2 size-4"/>Modes<ChevronDown className="ml-1 size-4" /></Button>
            </div>
        </div>
    );
};

export function ChatPageClient({ chatId }: { chatId?: string }) {
  const router = useRouter();
  
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
        const errorData = await enhanceRes.json();
        console.error("Failed to enhance response", errorData.error);
        toast({
          variant: "destructive",
          title: "Failed to enhance response",
          description: errorData.error,
        });
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
    }
  };
  
  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  if (hasMessages) {
    return (
        <div className="flex h-screen bg-[#F9F9F9] text-foreground">
          <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
              <Button variant="ghost" size="icon"><GrokLogo /></Button>
              <Button variant="ghost" size="icon" className="bg-gray-200 rounded-lg"><Search className="size-5 text-black" /></Button>
              <Button variant="ghost" size="icon"><SquarePen className="size-5 text-gray-600" /></Button>
              <Button variant="ghost" size="icon"><History className="size-5 text-gray-600" /></Button>
              <Button variant="ghost" size="icon"><Bot className="size-5 text-gray-600" /></Button>
              <Button variant="ghost" size="icon"><Settings className="size-5 text-gray-600" /></Button>
          </aside>
            <div className="flex flex-col flex-1">
                <header className="p-4 flex justify-end items-center">
                    <Button variant="outline" className="rounded-full border-gray-300">
                        <VenetianMask className="mr-2 size-4 text-gray-600" />
                        Privé
                    </Button>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {activeConversation.messages.map(message => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                    </div>
                </main>
                <footer className="p-4 bg-[#F9F9F9] flex flex-col items-center">
                    <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading} />
                </footer>
            </div>
        </div>
    )
  }

  return (
      <div className="flex h-screen bg-[#F9F9F9]">
          <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
              <Button variant="ghost" size="icon"><GrokLogo /></Button>
              <Button variant="ghost" size="icon" className="bg-gray-200 rounded-lg"><Search className="size-5 text-black" /></Button>
              <Button variant="ghost" size="icon"><SquarePen className="size-5 text-gray-600" /></Button>
              <Button variant="ghost" size="icon"><History className="size-5 text-gray-600" /></Button>
              <Button variant="ghost" size="icon"><Bot className="size-5 text-gray-600" /></Button>
              <Button variant="ghost" size="icon"><Settings className="size-5 text-gray-600" /></Button>
          </aside>
          <div className="flex-1 flex flex-col">
              <header className="p-4 flex justify-end items-center">
                  <Button variant="outline" className="rounded-full border-gray-300">
                      <VenetianMask className="mr-2 size-4 text-gray-600" />
                      Privé
                  </Button>
              </header>
              <main className="flex-1 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                    <GrokLogo />
                    <h1 className="text-4xl font-bold mt-4">Grok</h1>
                    <div className="mt-12 w-full">
                        <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading} />
                    </div>
                </div>
              </main>
          </div>
      </div>
  );
}

    
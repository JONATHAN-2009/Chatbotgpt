
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Conversation, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Paperclip, Rocket, ChevronDown, MoreHorizontal, Star, Upload, SquarePen, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/chat-message';
import { nanoid } from 'nanoid';

const GrokIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 text-black">
        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.63 15.207C16.444 15.392 16.188 15.5 15.923 15.5C15.658 15.5 15.402 15.392 15.216 15.207L12.489 12.485L9.778 15.196C9.592 15.381 9.336 15.489 9.071 15.489C8.806 15.489 8.55 15.381 8.364 15.196C7.993 14.825 7.993 14.225 8.364 13.854L11.075 11.143L8.364 8.432C7.993 8.061 7.993 7.461 8.364 7.09C8.735 6.719 9.335 6.719 9.706 7.09L12.417 9.801L15.216 7.002C15.587 6.631 16.187 6.631 16.558 7.002C16.929 7.373 16.929 7.973 16.558 8.344L13.759 11.143L16.63 13.94C17.001 14.311 17.001 14.836 16.63 15.207Z" fill="currentColor"/>
    </svg>
);

const ChatInput = ({ input, setInput, handleSendMessage, isLoading }: { input: string, setInput: (val: string) => void, handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void, isLoading: boolean }) => {
    const formRef = React.useRef<HTMLFormElement>(null);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4">
             <div className="relative w-full bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                <form ref={formRef} onSubmit={handleSendMessage} className="flex items-center">
                    <Button variant="ghost" size="sm" className="text-muted-foreground"><Paperclip className="size-5" /></Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Rocket className="mr-2 size-4" />
                        Automatique
                        <ChevronDown className="ml-1 size-4" />
                    </Button>
                    <Textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Comment Grok peut-il aider ?"
                        className="bg-transparent border-none focus:ring-0 resize-none w-full text-lg text-black flex-1"
                         onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              formRef.current?.requestSubmit();
                          }
                        }}
                        rows={1}
                    />
                    <div className="flex items-center">
                         <Button type="submit" size="icon" className="bg-black hover:bg-black/80 rounded-full w-10 h-10" disabled={isLoading || !input.trim()}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12C4 12 4 11.9997 4 11.9991C4 10.3804 4.50974 8.87311 5.43853 7.646C6.36732 6.41888 7.6669 5.54145 9.13593 5.14083C10.605 4.74021 12.1652 4.83983 13.5822 5.42168C15.0004 6.00414 16.2023 7.03533 17.0028 8.35881" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20 12C20 12 20 12.0003 20 12.0009C20 13.6196 19.4903 15.1269 18.5615 16.354C17.6327 17.5811 16.3331 18.4586 14.8641 18.8592C13.395 19.2598 11.8348 19.1602 10.4178 18.5783C8.99963 17.9959 7.79772 16.9647 6.99721 15.6412" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Button>
                    </div>
                </form>
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
    }
  };
  
  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  if (hasMessages) {
    return (
        <div className="flex flex-col h-screen bg-[#F9F9F9] text-foreground">
            <header className="p-4 flex justify-end items-center">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><SquarePen className="size-5 text-gray-600" /></Button>
                    <Button variant="ghost" size="icon"><Star className="size-5 text-gray-600" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="size-5 text-gray-600" /></Button>
                    <Button variant="outline" className="rounded-full border-gray-300">
                        <Upload className="mr-2 size-4 text-gray-600" />
                        Partager
                    </Button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    {activeConversation.messages.map(message => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                </div>
            </main>
            <footer className="p-4 bg-[#F9F9F9] flex flex-col items-center">
                 <Button variant="outline" className="rounded-full bg-white text-black mb-4">
                    <Sparkles className="mr-2 size-4" />
                    Réfléchir plus intensément
                </Button>
                <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading} />
            </footer>
        </div>
    )
  }

  return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
          <h1 className="text-4xl font-bold">Comment puis-je vous aider aujourd'hui ?</h1>
        </div>
      </div>
  );
}

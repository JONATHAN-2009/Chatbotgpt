
'use client';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExternalLink, RefreshCw, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, SquarePen, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback } from './ui/avatar';


const AiIcon = () => (
    <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="currentColor"/>
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
        <path d="M12 17C14.7614 17 17 14.7614 17 12H19C19 15.866 15.866 19 12 19V17Z" fill="currentColor"/>
        <path d="M7 12C7 9.23858 9.23858 7 12 7V5C8.13401 5 5 8.13401 5 12H7Z" fill="currentColor"/>
    </svg>
);


export function ChatMessage({ message }: { message: Message }) {
  const { role, content, url } = message;
  const isUser = role === 'user';

  if (isUser) {
    return (
        <div className="flex gap-3 justify-end">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 max-w-[80%]">
                <p className="text-black text-sm">{content}</p>
            </div>
             <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-600 text-white font-bold text-xs">C</AvatarFallback>
            </Avatar>
        </div>
    )
  }

  return (
     <div className="flex gap-3">
        <Avatar className="h-8 w-8 bg-black flex items-center justify-center text-white">
            <AiIcon />
        </Avatar>
        <div className='flex flex-col items-start gap-2'>
            <div className="prose prose-sm max-w-none text-black">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
                <Button variant="ghost" size="icon" className="h-7 w-7"><RefreshCw className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Upload className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><ThumbsUp className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><ThumbsDown className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="size-4" /></Button>
                <span className="text-xs">3,1s</span>
            </div>
            {url && (
                <div className="mt-1 text-left">
                    <Button variant="outline" size="sm" asChild className="h-8">
                        <Link href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 size-4" />
                            Learn more
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
}

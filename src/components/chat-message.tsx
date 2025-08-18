'use client';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User, ExternalLink, RefreshCw, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, SquarePen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import Link from 'next/link';

const GrokIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6">
        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.63 15.207C16.444 15.392 16.188 15.5 15.923 15.5C15.658 15.5 15.402 15.392 15.216 15.207L12.489 12.485L9.778 15.196C9.592 15.381 9.336 15.489 9.071 15.489C8.806 15.489 8.55 15.381 8.364 15.196C7.993 14.825 7.993 14.225 8.364 13.854L11.075 11.143L8.364 8.432C7.993 8.061 7.993 7.461 8.364 7.09C8.735 6.719 9.335 6.719 9.706 7.09L12.417 9.801L15.216 7.002C15.587 6.631 16.187 6.631 16.558 7.002C16.929 7.373 16.929 7.973 16.558 8.344L13.759 11.143L16.63 13.94C17.001 14.311 17.001 14.836 16.63 15.207Z" fill="currentColor"/>
    </svg>
);


export function ChatMessage({ message }: { message: Message }) {
  const { role, content, url } = message;
  const isUser = role === 'user';

  return (
    <div className={cn('flex items-start gap-4', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn("flex-shrink-0 size-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm", isUser ? 'order-2' : 'order-1')}>
        {isUser ? 'ED' : <GrokIcon />}
      </div>
      <div className={cn('flex-1 pt-0.5', isUser ? 'order-1 text-right' : 'order-2 text-left')}>
        <p className={cn("font-semibold", isUser ? 'text-right' : 'text-left')}>{isUser ? 'You' : 'Grok'}</p>
        <article className="prose prose-sm dark:prose-invert max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
        {!isUser && (
            <div className="mt-2 flex items-center gap-2 text-gray-500">
                <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><ThumbsUp className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><ThumbsDown className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="size-4" /></Button>
                <span className="text-xs">1,8s</span>
            </div>
        )}
         {isUser && (
            <div className="mt-2 flex items-center gap-2 text-gray-500 justify-end">
                <Button variant="ghost" size="icon" className="h-8 w-8"><SquarePen className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="size-4" /></Button>
            </div>
        )}
        {url && (
            <div className={cn("mt-2", isUser ? 'text-right' : 'text-left')}>
                <Button variant="outline" size="sm" asChild>
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

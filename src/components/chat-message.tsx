'use client';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import Link from 'next/link';

export function ChatMessage({ message }: { message: Message }) {
  const { role, content, url } = message;
  const isUser = role === 'user';

  return (
    <div className={cn('flex items-start gap-4')}>
      <div className="flex-shrink-0 size-8 rounded-full bg-muted flex items-center justify-center">
        {isUser ? <User className="size-5" /> : <Bot className="size-5 text-primary" />}
      </div>
      <div className={cn('flex-1 pt-0.5')}>
        <p className="font-semibold">{isUser ? 'You' : 'ChatGPT'}</p>
        <article className="prose prose-sm dark:prose-invert max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
        {url && (
            <div className="mt-2">
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

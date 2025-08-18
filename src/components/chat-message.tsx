
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-6"
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


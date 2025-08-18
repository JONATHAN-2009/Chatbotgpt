'use client';

import { Button } from '@/components/ui/button';
import { Bot, Sparkles } from 'lucide-react';

const examplePrompts = [
    'Explain the importance of project management in software development.',
    'Write a Python script to scrape a website.',
    'What are the best practices for building a REST API?',
    'Give me ideas for a new side project.',
];

interface EmptyScreenProps {
    onSelect: (prompt: string) => void;
}

export function EmptyScreen({ onSelect }: EmptyScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 h-full flex flex-col justify-center items-center">
      <div className="rounded-full border bg-primary/10 p-4 mb-4">
        <Bot className="size-10 text-primary" />
      </div>
      <h1 className="mb-8 text-2xl font-normal text-center">
        Prêt quand vous l'êtes.
      </h1>
    </div>
  );
}

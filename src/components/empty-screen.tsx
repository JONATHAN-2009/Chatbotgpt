'use client';

import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

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
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <div className='flex flex-col items-center text-center'>
            <div className='p-3 border border-primary/20 bg-primary/10 rounded-full mb-4'>
                <Bot className="size-10 text-primary" />
            </div>
            <h1 className="mb-2 text-2xl font-semibold">
              Welcome to GroqChat
            </h1>
            <p className="mb-8 text-muted-foreground leading-normal">
              Start a conversation by typing a message below or select one of the examples.
            </p>
        </div>
        <div className="space-y-4">
          {examplePrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full h-auto text-left justify-start p-4"
              onClick={() => onSelect(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

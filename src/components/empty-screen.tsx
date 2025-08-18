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
        <Sparkles className="size-10 text-primary" />
      </div>
      <h1 className="mb-2 text-3xl font-semibold text-center">
        How can I help you today?
      </h1>
      <p className="mb-8 text-muted-foreground leading-normal text-center max-w-md">
        Start a conversation by typing a message below or select one of the examples.
      </p>
      <div className="space-y-4 w-full">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {examplePrompts.slice(0, 2).map((prompt, index) => (
                <Button
                key={index}
                variant="outline"
                className="w-full h-auto text-left justify-start p-4 rounded-xl"
                onClick={() => onSelect(prompt)}
                >
                {prompt}
                </Button>
            ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {examplePrompts.slice(2, 4).map((prompt, index) => (
                <Button
                key={index}
                variant="outline"
                className="w-full h-auto text-left justify-start p-4 rounded-xl"
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

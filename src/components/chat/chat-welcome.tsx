'use client';

import { motion } from 'framer-motion';
import { Bot, Code, Lightbulb, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatWelcomeProps {
  onSuggestionClick?: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: Code,
    title: 'Help me code',
    description: 'Write a React component',
    prompt: 'Help me write a React component that displays a list of items with search and filter functionality.',
  },
  {
    icon: Lightbulb,
    title: 'Explain a concept',
    description: 'Break down complex topics',
    prompt: 'Explain how async/await works in JavaScript with examples.',
  },
  {
    icon: MessageSquare,
    title: 'Write content',
    description: 'Draft emails or documents',
    prompt: 'Help me write a professional email to request a meeting with a potential client.',
  },
  {
    icon: Sparkles,
    title: 'Get creative',
    description: 'Brainstorm ideas',
    prompt: 'Suggest 5 creative project ideas for a portfolio that showcases full-stack development skills.',
  },
];

export function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6 max-w-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">How can I help you today?</h1>
          <p className="text-muted-foreground">
            I&apos;m your AI assistant. Ask me anything, and I&apos;ll do my best to help.
          </p>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={suggestion.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto flex flex-col items-start gap-1 p-4 text-left hover:bg-muted/50"
                  onClick={() => onSuggestionClick?.(suggestion.prompt)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{suggestion.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

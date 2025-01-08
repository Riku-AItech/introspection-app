'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [poem, setPoem] = useState<string | null>(null);

  // 初期メッセージを設定
  useEffect(() => {
    const initialMessage: Message = {
      role: 'assistant',
      content: 'こんにちはワン！柴犬の賢者だよ。これからあなたと5回の対話を通じて、あなたの心の中を一緒に探検していきたいと思うんだ。そして最後に、あなたが本当にやりたいことや、これからの人生の指針となる言葉を贈らせてほしいワン。まずは、今のあなたの気持ちを聞かせてくれるかな？'
    };
    setMessages([initialMessage]);
  }, []);

  const generatePoem = async () => {
    try {
      const response = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      if (data.poem) {
        setPoem(data.poem);
        // 詩を生成した後、それを柴犬からのメッセージとして追加
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `君との対話から、こんな詩が生まれたんだワン！\n\n${data.poem}\n\nこの詩があなたの道しるべになりますように...✨`
        }]);
      }
    } catch (error) {
      console.error('Error generating poem:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        setConversationCount(prev => prev + 1);

        // 5回の対話が完了したら詩を生成
        if (conversationCount === 4) {
          await generatePoem();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-indigo-400/30 scrollbar-track-transparent px-6 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } items-end space-x-2`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/柴犬魔法使い.jpg-ga7pDHemgJzOAmWQpXHuHVW8qc8BFI.jpeg"
                  alt="Shiba Sage"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            )}
            <div
              className={`max-w-[65%] rounded-2xl p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-500/80 text-white backdrop-blur-sm'
                  : message.content.includes('詩が生まれた')
                  ? 'bg-gradient-to-r from-indigo-500/40 to-purple-500/40 text-indigo-100 backdrop-blur-sm border border-indigo-400/20'
                  : 'bg-white/10 text-indigo-100 backdrop-blur-sm border border-indigo-400/20'
              }`}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/80 flex items-center justify-center text-white text-xs">
                私
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3 bg-white/5 backdrop-blur-sm border-t border-indigo-400/20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={isLoading || poem !== null}
            className="flex-1 bg-white/5 border-indigo-400/20 text-indigo-100 placeholder-indigo-300/50 text-sm py-5"
          />
          <Button 
            type="submit" 
            disabled={isLoading || poem !== null}
            className="bg-indigo-500/80 hover:bg-indigo-600/80 text-white px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
} 
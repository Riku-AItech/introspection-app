'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
          content: `君との対話から、こんな詩が生まれたんだワン！\n\n${data.poem}\n\nこの詩があなたの道しるべになりますように...✨\n\nさあ、次は一緒にあなたの人生の軌跡を振り返ってみましょう。「次へ」ボタンを押してください！`
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
      // 5回目の対話の場合は、APIを呼ばずに直接詩を生成
      if (conversationCount === 4) {
        await generatePoem();
        setConversationCount(prev => prev + 1);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        setConversationCount(prev => prev + 1);

        // 4回目の対話が完了した後、次の対話（5回目）で詩を生成することを予告
        if (conversationCount === 3) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'ありがとう！次の対話で最後の質問をさせてください。その後、あなたの心の中から生まれた詩を贈らせていただきます。'
          }]);
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
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-indigo-400/30 scrollbar-track-transparent px-8 py-6 min-h-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } items-end space-x-3`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/柴犬魔法使い.jpg-ga7pDHemgJzOAmWQpXHuHVW8qc8BFI.jpeg"
                  alt="Shiba Sage"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-indigo-500/80 text-white backdrop-blur-sm'
                  : message.content.includes('詩が生まれた')
                  ? 'bg-gradient-to-r from-indigo-500/40 to-purple-500/40 text-indigo-100 backdrop-blur-sm border border-indigo-400/20'
                  : 'bg-white/10 text-indigo-100 backdrop-blur-sm border border-indigo-400/20'
              }`}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className="whitespace-pre-wrap text-base leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/80 flex items-center justify-center text-white text-base">
                私
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-6 bg-white/5 backdrop-blur-sm border-t border-indigo-400/20">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={isLoading || poem !== null}
            className="flex-1 bg-white/5 border-indigo-400/20 text-indigo-100 placeholder-indigo-300/50 text-base py-7"
          />
          <Button 
            type="submit" 
            disabled={isLoading || poem !== null}
            className="bg-indigo-500/80 hover:bg-indigo-600/80 text-white px-8"
          >
            <Send className="h-6 w-6" />
          </Button>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex justify-center gap-4 mt-6"
        >
          <Link href="/roadmap">
            <Button
              className="bg-gradient-to-r from-indigo-500/80 to-purple-500/80 hover:from-indigo-600/80 hover:to-purple-600/80 text-white px-10 py-5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
            >
              {poem ? "次へ" : "スキップ"}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 
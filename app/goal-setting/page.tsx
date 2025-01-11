'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GoalMindmap } from '../components/goal-mindmap';

export default function GoalSettingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900 p-4 relative overflow-hidden">
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/geometric-pattern.svg')] bg-repeat opacity-50" />
      </div>

      {/* Stained glass effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-overlay filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-overlay filter blur-3xl" />
      </div>

      {/* Navigation buttons */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white"
          size="icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white"
          size="icon"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center mb-6"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-xl" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/柴犬魔法使い.jpg-ga7pDHemgJzOAmWQpXHuHVW8qc8BFI.jpeg"
                alt="Mystical Shiba Guide"
                width={100}
                height={100}
                className="relative rounded-full border-4 border-indigo-400/50 shadow-lg shadow-indigo-500/30"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <Card className="relative overflow-hidden backdrop-blur-xl border-0 bg-white/5">
              <CardHeader className="relative space-y-2 text-center">
                <CardTitle className="text-2xl font-bold font-serif">
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    未来への目標を設定
                  </span>
                </CardTitle>
                <CardDescription className="text-indigo-200/90 text-base">
                  これからのあなたの目標を設定し、実現への道筋を描きましょう
                </CardDescription>
              </CardHeader>

              <GoalMindmap />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
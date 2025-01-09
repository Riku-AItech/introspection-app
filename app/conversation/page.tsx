'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { ChatInterface } from '../components/chat-interface'
import { BackgroundMusic } from '../components/background-music'
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ConversationPage() {
  const router = useRouter()

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
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-overlay filter blur-3xl" />
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
      <div className="container mx-auto max-w-4xl h-screen py-8">
        <div className="flex flex-col h-[calc(100vh-4rem)]">
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
            className="flex-1 min-h-0"
          >
            <Card className="h-full relative overflow-hidden backdrop-blur-xl border-0 bg-white/5">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
              
              {/* Decorative geometric elements */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-indigo-400/30" />
              <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-indigo-400/30" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-indigo-400/30" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-indigo-400/30" />
              
              <CardHeader className="relative space-y-2 pb-4">
                <CardTitle className="text-2xl font-bold text-center font-serif">
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    内省の時間
                  </span>
                </CardTitle>
                <CardDescription className="text-center text-indigo-200/90 text-base font-light">
                  柴犬と一緒に、心の中を探検しましょう
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-120px)] p-0">
                <ChatInterface />
              </CardContent>

              {/* Art Deco inspired corner elements */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-indigo-400/30 rounded-br-3xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-indigo-400/30 rounded-bl-3xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-indigo-400/30 rounded-tr-3xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-indigo-400/30 rounded-tl-3xl" />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Background Music Control */}
      <BackgroundMusic />
    </div>
  )
}


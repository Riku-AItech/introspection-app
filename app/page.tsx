'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Image from 'next/image'

export default function StartScreen() {
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

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-xl" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/柴犬魔法使い.jpg-ga7pDHemgJzOAmWQpXHuHVW8qc8BFI.jpeg"
                alt="Mystical Shiba Guide"
                width={150}
                height={150}
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
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
              
              {/* Decorative geometric elements */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-indigo-400/30" />
              <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-indigo-400/30" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-indigo-400/30" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-indigo-400/30" />
              
              <CardHeader className="relative space-y-4">
                <CardTitle className="text-4xl font-bold text-center font-serif">
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    内省の時間
                  </span>
                </CardTitle>
                <CardDescription className="text-center text-indigo-200/90 text-lg font-light">
                  神秘的な世界で、自分自身を見つめ直す静かな時間
                </CardDescription>
              </CardHeader>
              <CardContent className="relative flex flex-col items-center space-y-6 pb-8">
                <p className="text-base text-indigo-100/80 text-center max-w-2xl leading-relaxed">
                  神秘的な柴犬の導きのもと、心の奥底にある思いを探ってみましょう。
                  この静寂な空間で、あなたの内なる声に耳を傾けます。
                </p>
                <Link href="/conversation">
                  <Button 
                    className="relative group px-8 py-4 text-lg overflow-hidden bg-transparent border border-indigo-400/50 rounded-none"
                  >
                    {/* Button background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/80 to-purple-500/80 opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                    
                    {/* Button text */}
                    <span className="relative z-10 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent font-medium uppercase tracking-wider">
                      神秘の空間へ
                    </span>
                  </Button>
                </Link>
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
    </div>
  )
}


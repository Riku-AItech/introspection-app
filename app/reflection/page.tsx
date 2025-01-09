'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { Home, ArrowLeft } from 'lucide-react';

export default function ReflectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poem = searchParams.get('poem');
  const chartData = JSON.parse(searchParams.get('chartData') || '{}');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (contentRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(contentRef.current, {
          quality: 1.0,
          backgroundColor: '#1e1b4b',
        });
        
        const link = document.createElement('a');
        link.download = '人生の軌跡.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

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
      <div className="container mx-auto max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            あなたの人生の軌跡
          </h1>
          <p className="text-indigo-200 mt-2">
            これまでの道のりと、これからの可能性
          </p>
        </motion.div>

        <div ref={contentRef} className="space-y-6 bg-indigo-900 p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-sm border-indigo-400/20">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-200">人生の満足度の変遷</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.8)' }
                      },
                      x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.8)' }
                      }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-indigo-400/20">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-200">あなたへの詩</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-indigo-100 whitespace-pre-wrap font-serif leading-relaxed">
                  {poem}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 backdrop-blur-sm border-indigo-400/20">
            <CardContent className="p-6">
              <div className="mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/柴犬魔法使い.jpg-ga7pDHemgJzOAmWQpXHuHVW8qc8BFI.jpeg"
                  alt="Mystical Shiba Guide"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-indigo-400/50 shadow-lg mx-auto"
                />
              </div>
              <p className="text-indigo-100 text-lg mb-4">
                あなたの人生の軌跡を見つめ直してみていかがでしたか？
              </p>
              <p className="text-indigo-200">
                過去の経験は、すべてあなたを今の姿に導いてくれました。<br />
                そして詩に込められた言葉は、きっとこれからのあなたの道しるべとなってくれるはずです。<br />
                あなたの本当にしたいことを見つけ、素晴らしい人生を送られますように...✨
              </p>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-indigo-500/80 to-purple-500/80 hover:from-indigo-600/80 hover:to-purple-600/80 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            画像として保存する
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 
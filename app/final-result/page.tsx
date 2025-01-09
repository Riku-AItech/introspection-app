'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Home, ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FinalResultPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const { lifeEvents, poem, mindmap } = useAppStore();

  const chartData = {
    labels: lifeEvents.map(event => `${event.age}歳`),
    datasets: [
      {
        label: '人生の満足度',
        data: lifeEvents.map(event => event.happiness),
        fill: false,
        borderColor: 'rgba(147, 51, 234, 0.8)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(147, 51, 234, 0.8)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        }
      }
    }
  };

  const renderMindmapNode = (node: any, level: number = 0) => {
    const baseClassName = "relative p-4 rounded-lg border border-indigo-400/20 bg-white/5 backdrop-blur-sm";
    const levelColors = [
      "from-purple-500/40 to-indigo-500/40",
      "from-indigo-500/40 to-blue-500/40",
      "from-blue-500/40 to-cyan-500/40"
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: level * 0.1 }}
        className="relative"
        key={node.id}
      >
        <div className={`${baseClassName} bg-gradient-to-r ${levelColors[level % 3]}`}>
          <p className="text-indigo-100">{node.content}</p>
        </div>
        {node.children.length > 0 && (
          <div className="ml-8 mt-4 space-y-4 border-l-2 border-indigo-400/20 pl-4">
            {node.children.map((child: any) => renderMindmapNode(child, level + 1))}
          </div>
        )}
      </motion.div>
    );
  };

  const saveAsImage = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = '人生の軌跡.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error saving image:', error);
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
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col" ref={contentRef}>
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
            className="space-y-6"
          >
            {/* 詩のセクション */}
            <Card className="relative overflow-hidden backdrop-blur-xl border-0 bg-white/5">
              <CardHeader className="relative space-y-2 text-center">
                <CardTitle className="text-2xl font-bold font-serif">
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    あなたへの詩
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-indigo-100 text-center italic">
                {poem}
              </CardContent>
            </Card>

            {/* 人生の軌跡グラフ */}
            <Card className="relative overflow-hidden backdrop-blur-xl border-0 bg-white/5">
              <CardHeader className="relative space-y-2 text-center">
                <CardTitle className="text-2xl font-bold font-serif">
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    人生の軌跡
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            {/* 未来への目標マインドマップ */}
            <Card className="relative overflow-hidden backdrop-blur-xl border-0 bg-white/5">
              <CardHeader className="relative space-y-2 text-center">
                <CardTitle className="text-2xl font-bold font-serif">
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    未来への道のり
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mindmap && renderMindmapNode(mindmap)}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 画像として保存ボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-8 flex justify-center"
        >
          <Button
            onClick={saveAsImage}
            className="bg-indigo-500/80 hover:bg-indigo-600/80 text-white px-8 py-6 text-lg flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            画像として保存する
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 
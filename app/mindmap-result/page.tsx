'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Download } from 'lucide-react';

export default function MindmapResultPage() {
  const router = useRouter();
  const { mindmap, resetStore } = useAppStore();

  useEffect(() => {
    if (!mindmap) {
      router.push('/goal-setting');
    }
  }, [mindmap, router]);

  const handleHomeClick = () => {
    resetStore(); // すべてのデータをリセット
    router.push('/');
  };

  const renderMindmapNode = (node: any, level: number = 0) => {
    const baseClassName = "relative p-4 rounded-xl border-2 min-w-[200px] backdrop-blur-sm";
    const levelColors = [
      "border-purple-400/50 bg-purple-500/10 shadow-lg shadow-purple-500/20",  // ルート
      "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20",      // 長期
      "border-indigo-400/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/20",  // 中期
      "border-green-400/50 bg-green-500/10 shadow-lg shadow-green-500/20"     // 短期
    ];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: level * 0.1 }}
        className="relative"
        key={node.id}
      >
        <div className={`${baseClassName} ${levelColors[level]} transition-all duration-300 hover:scale-105`}>
          <p className="text-indigo-100 font-medium text-lg">{node.content}</p>
        </div>
        {node.children && node.children.length > 0 && (
          <div className={`relative mt-12 ${level === 0 ? 'ml-0' : 'ml-16'}`}>
            <div className="absolute left-1/2 -top-8 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400" />
            <div className="grid gap-10">
              {node.children.map((child: any, index: number) => (
                <div key={child.id} className="relative">
                  {index > 0 && (
                    <div className="absolute -top-5 left-1/2 w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-400" />
                  )}
                  {renderMindmapNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (!mindmap) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <div className="fixed top-4 left-4 z-10 flex gap-2">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-indigo-200 hover:text-indigo-100 hover:bg-indigo-500/20"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          戻る
        </Button>
        <Button
          onClick={handleHomeClick}
          variant="ghost"
          className="text-indigo-200 hover:text-indigo-100 hover:bg-indigo-500/20"
        >
          <Home className="w-5 h-5 mr-1" />
          ホーム
        </Button>
      </div>

      <div className="container max-w-6xl mx-auto p-6 pt-20">
        <Card className="bg-indigo-950/50 border-indigo-400/20 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
                目標マップの生成結果
              </h1>
              <p className="text-indigo-200/80">
                あなたの目標が階層的に整理され、実現への道筋が明確になりました
              </p>
            </div>
            
            <div className="bg-indigo-900/20 rounded-xl border border-indigo-400/20 p-8 overflow-x-auto">
              <div className="min-w-[800px] p-8">
                {renderMindmapNode(mindmap)}
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 mt-8">
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/goal-setting')}
                  variant="outline"
                  className="text-indigo-200 border-indigo-400/20 hover:bg-indigo-900/50 px-6"
                >
                  目標を編集する
                </Button>
                <Button
                  onClick={() => router.push('/final-result')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6"
                >
                  最終結果を確認する
                </Button>
              </div>
              <p className="text-indigo-200/60 text-sm">
                目標の編集が必要な場合は「目標を編集する」を、このまま進む場合は「最終結果を確認する」をクリックしてください
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
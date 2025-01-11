'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

export default function MindmapResultPage() {
  const router = useRouter();
  const { mindmap, resetStore } = useAppStore();

  // ホームボタンクリック時はデータをリセットしてホームに戻る
  const handleHomeClick = () => {
    resetStore();
    router.push('/');
  };

  // 戻るボタンクリック時はデータを保持したまま戻る
  const handleBackClick = () => {
    router.back();
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
          onClick={handleBackClick}
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white"
          size="icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleHomeClick}
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white"
          size="icon"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">目標達成への道筋</h1>

        <Card className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border-0">
          <div className="h-[600px] bg-white/5 rounded-lg">
            {mindmap && typeof mindmap === 'object' && mindmap !== null && (
              <ReactFlow
                nodes={(mindmap as any).nodes?.map((node: any) => ({
                  ...node,
                  position: node.position || { x: 0, y: 0 },
                })) || []}
                edges={(mindmap as any).edges?.map((edge: any) => ({
                  ...edge,
                  id: edge.id || '',
                  source: edge.source || '',
                  target: edge.target || '',
                })) || []}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
              >
                <Background color="#ffffff20" gap={16} />
                <Controls showInteractive={false} />
                <MiniMap
                  nodeColor={(node) => {
                    switch (node.type) {
                      case 'root':
                        return '#4a5568';
                      case 'goal':
                        return '#4299e1';
                      case 'step':
                        return '#38b2ac';
                      default:
                        return '#cbd5e0';
                    }
                  }}
                />
              </ReactFlow>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => router.push('/final-result')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-lg flex items-center gap-2"
            >
              最終結果を見る
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 
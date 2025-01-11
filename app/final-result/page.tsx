'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

// ノードの型定義
interface Position {
  x: number;
  y: number;
}

// ReactFlowのノード型定義
type MindMapNode = {
  id: string;
  type: string;
  data: {
    label: string;
  };
  position: Position;
};

// エッジの型定義
type MindMapEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
};

export default function FinalResultPage() {
  const router = useRouter();
  const { 
    poem, 
    mindmap, 
    resetStore,
    lifeEvents,
    goals,
    mindmapContent
  } = useAppStore();

  // ノードの位置を計算
  const calculateNodePosition = (node: MindMapNode): Position => {
    const baseX = 600;
    const baseY = 100;
    
    switch (node.type) {
      case 'root':
        return { x: baseX, y: 50 };
      case 'goal':
        const goalOffsets = {
          '長期': { x: -400, y: 150 },
          '中期': { x: 0, y: 150 },
          '短期': { x: 400, y: 150 },
        };
        const goalType = node.data.label.includes('長期') ? '長期' :
                        node.data.label.includes('中期') ? '中期' : '短期';
        return {
          x: baseX + goalOffsets[goalType].x,
          y: baseY + goalOffsets[goalType].y,
        };
      case 'step':
        if (node.data.label.includes('ステップ')) {
          const stepIndex = parseInt(node.id.split('-').pop() || '1');
          const parentType = node.data.label.includes('長期') ? '長期' :
                           node.data.label.includes('中期') ? '中期' : '短期';
          const parentPos = calculateNodePosition({
            id: 'parent',
            type: 'goal',
            data: { label: parentType },
            position: { x: 0, y: 0 }
          });
          return {
            x: parentPos.x,
            y: parentPos.y + 100 + (stepIndex - 1) * 80,
          };
        }
        return { x: baseX, y: baseY };
      default:
        return { x: baseX, y: baseY };
    }
  };

  // ホームボタンクリック時はデータをリセットしてホームに戻る
  const handleHomeClick = () => {
    resetStore();
    router.push('/');
  };

  // 戻るボタンクリック時はデータを保持したまま戻る
  const handleBackClick = () => {
    router.back();
  };

  // ノードのスタイルを設定
  const getNodeStyle = (type: string) => {
    const baseStyle = {
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold' as const,
      border: '2px solid',
      textAlign: 'center' as const,
      width: '300px',
    };

    switch (type) {
      case 'root':
        return {
          ...baseStyle,
          background: '#4a5568',
          borderColor: '#2d3748',
          color: 'white',
        };
      case 'goal':
        return {
          ...baseStyle,
          background: '#4299e1',
          borderColor: '#2b6cb0',
          color: 'white',
        };
      case 'step':
        return {
          ...baseStyle,
          background: '#38b2ac',
          borderColor: '#2c7a7b',
          color: 'white',
        };
      default:
        return {
          ...baseStyle,
          background: '#cbd5e0',
          borderColor: '#a0aec0',
          color: '#2d3748',
        };
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
        <h1 className="text-3xl font-bold text-center mb-8 text-white">最終結果</h1>

        <div className="space-y-8">
          {/* Poem section */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border-0">
            <h2 className="text-2xl font-semibold mb-4 text-white">あなたのための詩</h2>
            <div className="text-white/90 whitespace-pre-wrap">{poem}</div>
          </Card>

          {/* Life events section */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border-0">
            <h2 className="text-2xl font-semibold mb-4 text-white">あなたの人生の軌跡</h2>
            <div className="space-y-4">
              {lifeEvents.map((event, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium text-white">Age {event.age}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/80">幸福度:</span>
                      <div className="w-24 h-2 bg-white/10 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                          style={{ width: `${event.happiness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90">{event.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Edited goals and roadmap section */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border-0">
            <h2 className="text-2xl font-semibold mb-4 text-white">編集後の目標と達成への道筋</h2>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      goal.type === '短期' ? 'bg-blue-500/20 text-blue-300' :
                      goal.type === '中期' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {goal.type}
                    </span>
                    <p className="text-white/90">{goal.content}</p>
                  </div>
                </div>
              ))}
              {mindmapContent && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <pre className="text-white/90 whitespace-pre-wrap">{mindmapContent}</pre>
                </div>
              )}
            </div>
          </Card>

          {/* Mind map section */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border-0">
            <h2 className="text-2xl font-semibold mb-4 text-white">目標達成への道筋</h2>
            <div className="h-[800px] bg-white/5 rounded-lg">
              {mindmap && (
               <ReactFlow
                 nodes={mindmap.nodes.map((node) => ({
                   id: node.id,
                   type: 'default',
                   data: { label: node.label },
                   position: node.position || calculateNodePosition({
                     id: node.id,
                     type: node.type,
                     data: { label: node.label },
                     position: { x: 0, y: 0 }
                   }),
                   style: getNodeStyle(node.type),
                 }))}
                 edges={(mindmap.edges || []).map((edge) => ({
                   id: edge.id,
                   source: edge.source,
                   target: edge.target,
                   type: 'smoothstep',
                   animated: true,
                   style: { stroke: '#ffffff40', strokeWidth: 2 },
                 }))}
                 fitView
                 minZoom={0.5}
                 maxZoom={1.5}
                 defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
                    maskColor="#00000060"
                  />
                </ReactFlow>
              )}
            </div>
          </Card>

          {/* Shiba Inu message */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border-0">
            <div className="flex items-center gap-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/柴犬魔法使い.jpg-ga7pDHemgJzOAmWQpXHuHVW8qc8BFI.jpeg"
                alt="柴犬"
                className="w-16 h-16 rounded-full border-2 border-white/20 shadow-lg"
              />
              <div className="text-white">
                <p className="text-lg">
                  あなたの人生の道筋を一緒に考えることができて嬉しかったワン！
                  これからも自分の本当にやりたいことを見つけていってほしいワン。
                  応援しているワン！
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

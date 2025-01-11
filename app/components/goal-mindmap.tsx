'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface MindmapNode {
  id: string;
  type: string;
  label: string;
  parent?: string;
}

interface Goal {
  type: '短期' | '中期' | '長期';
  content: string;
}

export function GoalMindmap() {
  const router = useRouter();
  const { goals, setGoals, setMindmap, resetStore } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shortTermGoal, setShortTermGoal] = useState('');
  const [midTermGoal, setMidTermGoal] = useState('');
  const [longTermGoal, setLongTermGoal] = useState('');

  const handleAddGoals = () => {
    if (!shortTermGoal || !midTermGoal || !longTermGoal) {
      alert('すべての目標を入力してください');
      return;
    }

    const newGoals: Goal[] = [
      { type: '短期', content: shortTermGoal },
      { type: '中期', content: midTermGoal },
      { type: '長期', content: longTermGoal },
    ];

    setGoals(newGoals);
  };

  const generateMindmap = async () => {
    if (!goals || goals.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        console.log('マインドマップデータを受信:', data.data);
        createMindmapFromData(data.data);
        setMindmap(data.data);
      } else {
        console.error('マインドマップの生成に失敗:', data.error);
        alert('マインドマップの生成に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Error generating mindmap:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const createMindmapFromData = useCallback((data: any) => {
    if (!data || !data.nodes) return;

    const nodeElements = data.nodes.map((node: any) => ({
      id: node.id,
      type: 'default',
      data: { label: node.label },
      position: calculateNodePosition(node),
      style: getNodeStyle(node.type),
    }));

    const edgeElements = data.nodes
      .filter((node: any) => node.parent)
      .map((node: any) => ({
        id: `edge-${node.parent}-${node.id}`,
        source: node.parent,
        target: node.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#4299e1' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4299e1',
        },
      }));

    console.log('生成されたノード:', nodeElements);
    console.log('生成されたエッジ:', edgeElements);

    setNodes(nodeElements);
    setEdges(edgeElements);
  }, [setNodes, setEdges]);

  const calculateNodePosition = (node: MindmapNode): Position => {
    const baseX = 600;
    const baseY = 100;
    
    // ノードタイプに基づいて位置を計算
    switch (node.type) {
      case 'root':
        return { x: baseX, y: 50 };
      case 'goal':
        const goalOffsets = {
          '長期': { x: -400, y: 150 },
          '中期': { x: 0, y: 150 },
          '短期': { x: 400, y: 150 },
        };
        const goalType = node.label.includes('長期') ? '長期' : 
                        node.label.includes('中期') ? '中期' : '短期';
        return {
          x: baseX + goalOffsets[goalType].x,
          y: baseY + goalOffsets[goalType].y,
        };
      case 'step':
        // 親ノードの位置に基づいて配置
        if (node.parent) {
          const parentPos = calculateNodePosition({
            id: node.parent,
            type: 'goal',
            label: '',
          });
          const stepIndex = parseInt(node.id.split('-').pop() || '1');
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

  const getNodeStyle = (type: string) => {
    const baseStyle = {
      padding: '10px',
      borderRadius: '8px',
      width: 300,
      fontSize: '14px',
      textAlign: 'center' as const,
    };

    switch (type) {
      case 'root':
        return {
          ...baseStyle,
          background: '#4a5568',
          color: 'white',
          border: '1px solid #2d3748',
          fontWeight: 'bold',
        };
      case 'goal':
        return {
          ...baseStyle,
          background: '#ebf8ff',
          border: '2px solid #4299e1',
          color: '#2c5282',
          fontWeight: 'bold',
        };
      case 'step':
        return {
          ...baseStyle,
          background: '#e6fffa',
          border: '1px solid #38b2ac',
          color: '#234e52',
        };
      default:
        return baseStyle;
    }
  };

  const handleHomeClick = () => {
    resetStore();
    setShortTermGoal('');
    setMidTermGoal('');
    setLongTermGoal('');
    router.push('/');
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="longTerm">長期目標（5年後までに達成したい目標）</Label>
            <Input
              id="longTerm"
              value={longTermGoal}
              onChange={(e) => setLongTermGoal(e.target.value)}
              placeholder="例：グローバル企業でマネージャーになる"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="midTerm">中期目標（1-3年で達成したい目標）</Label>
            <Input
              id="midTerm"
              value={midTermGoal}
              onChange={(e) => setMidTermGoal(e.target.value)}
              placeholder="例：プロジェクトリーダーとして成果を出す"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="shortTerm">短期目標（半年以内に達成したい目標）</Label>
            <Input
              id="shortTerm"
              value={shortTermGoal}
              onChange={(e) => setShortTermGoal(e.target.value)}
              placeholder="例：業務効率化の提案を行う"
              className="mt-1"
            />
          </div>
          {!goals.length ? (
            <Button
              onClick={handleAddGoals}
              disabled={!shortTermGoal || !midTermGoal || !longTermGoal}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              目標を設定
            </Button>
          ) : !nodes.length ? (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">設定された目標</h3>
                <div className="mt-2 space-y-2 text-left">
                  <p>長期目標: {longTermGoal}</p>
                  <p>中期目標: {midTermGoal}</p>
                  <p>短期目標: {shortTermGoal}</p>
                </div>
              </div>
              <Button
                onClick={generateMindmap}
                disabled={isLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {isLoading ? 'マインドマップを生成中...' : 'マインドマップを生成'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/final-result')}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2"
              >
                最終結果を見る
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {nodes.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">目標達成への道筋</h2>
          <div className="h-[800px] bg-white rounded-lg shadow-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
              <Background color="#f0f0f0" gap={16} />
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
          </div>
        </Card>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface Goal {
  type: '短期' | '中期' | '長期';
  content: string;
}

interface MindmapNode {
  id: string;
  content: string;
  children: MindmapNode[];
}

export function GoalMindmap() {
  const router = useRouter();
  const { goals, setGoals, setMindmap } = useAppStore();
  const getAvailableGoalTypes = (): Goal['type'][] => {
    const existingTypes = goals.map(g => g.type);
    const allTypes: Goal['type'][] = ['短期', '中期', '長期'];
    return allTypes.filter(type => !existingTypes.includes(type));
  };
  const [newGoal, setNewGoal] = useState<Goal>({
    type: getAvailableGoalTypes()[0] || '短期',
    content: ''
  });
  const [editingGoal, setEditingGoal] = useState<{ index: number; goal: Goal } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasAllGoalTypes = () => {
    const types = goals.map(g => g.type);
    return types.includes('短期') && types.includes('中期') && types.includes('長期');
  };

  const addGoal = () => {
    if (newGoal.content.trim()) {
      const existingGoal = goals.find(g => g.type === newGoal.type);
      
      if (editingGoal !== null) {
        const updatedGoals = [...goals];
        updatedGoals[editingGoal.index] = { ...newGoal };
        setGoals(updatedGoals);
        setEditingGoal(null);
      } else {
        if (existingGoal) {
          return;
        }
        setGoals([...goals, { ...newGoal }]);
      }
      
      const remainingTypes = getAvailableGoalTypes().filter(type => type !== newGoal.type);
      if (remainingTypes.length > 0) {
        setNewGoal({
          type: remainingTypes[0],
          content: ''
        });
      } else {
        setNewGoal({
          type: getAvailableGoalTypes()[0] || '短期',
          content: ''
        });
      }
    }
  };

  const editGoal = (index: number) => {
    const goalToEdit = goals[index];
    setEditingGoal({ index, goal: goalToEdit });
    setNewGoal(goalToEdit);
  };

  const deleteGoal = (index: number) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    if (editingGoal?.index === index) {
      setEditingGoal(null);
    }
    const availableTypes = getAvailableGoalTypes();
    setNewGoal({
      type: availableTypes[0] || '短期',
      content: ''
    });
  };

  const generateMindmap = async () => {
    if (goals.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals }),
      });

      const data = await response.json();
      if (data.mindmap) {
        setMindmap(data.mindmap);
        router.push('/mindmap-result');
      }
    } catch (error) {
      console.error('Error generating mindmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMindmapNode = (node: MindmapNode, level: number = 0) => {
    const baseClassName = "relative p-4 rounded-lg border-2 min-w-[180px] text-center";
    const levelColors = [
      "border-purple-500 bg-purple-500/20",  // ルート
      "border-blue-500 bg-blue-500/20",      // 長期
      "border-indigo-500 bg-indigo-500/20",  // 中期
      "border-green-500 bg-green-500/20"     // 短期
    ];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: level * 0.1 }}
        className="relative"
        key={node.id}
      >
        <div className={`${baseClassName} ${levelColors[level]}`}>
          <p className="text-indigo-100 font-medium">{node.content}</p>
        </div>
        {node.children.length > 0 && (
          <div className={`relative mt-8 ${level === 0 ? 'ml-0' : 'ml-12'}`}>
            <div className="absolute left-1/2 -top-6 w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500" />
            <div className="grid gap-8">
              {node.children.map((child, index) => (
                <div key={child.id} className="relative">
                  {index > 0 && <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gradient-to-b from-indigo-500 to-purple-500" />}
                  {renderMindmapNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const previewMindmap = () => {
    if (goals.length === 0) return null;

    // 目標を期間でグループ化
    const longTermGoals = goals.filter(g => g.type === '長期');
    const midTermGoals = goals.filter(g => g.type === '中期');
    const shortTermGoals = goals.filter(g => g.type === '短期');

    // 長期目標を親として、中期・短期目標を子として構造化
    const rootNode: MindmapNode = {
      id: 'root',
      content: '未来への道のり',
      children: longTermGoals.map(longTerm => ({
        id: `long-${longTerm.content}`,
        content: longTerm.content,
        children: midTermGoals.map(midTerm => ({
          id: `mid-${midTerm.content}`,
          content: midTerm.content,
          children: shortTermGoals.map(shortTerm => ({
            id: `short-${shortTerm.content}`,
            content: shortTerm.content,
            children: []
          }))
        }))
      }))
    };

    return (
      <div className="mt-8 p-6 bg-indigo-900/30 rounded-lg border border-indigo-400/20">
        <h3 className="text-xl font-semibold text-indigo-100 mb-6 text-center">マインドマップのプレビュー</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[800px] p-8">
            {renderMindmapNode(rootNode)}
          </div>
        </div>
      </div>
    );
  };

  const getGoalTypeError = () => {
    if (editingGoal !== null) {
      if (editingGoal.goal.type === newGoal.type) {
        return null;
      }
    }
    
    const existingGoal = goals.find(g => g.type === newGoal.type);
    if (existingGoal) {
      return `${newGoal.type}目標は既に設定されています`;
    }
    
    return null;
  };

  return (
    <CardContent className="p-6 space-y-6">
      <div className="space-y-6">
        <div className="text-sm text-indigo-200/80 bg-indigo-500/10 p-4 rounded-md border border-indigo-400/20 space-y-3">
          <p className="font-semibold text-indigo-100">マインドマップを生成するには、以下の目標をすべて設定してください：</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-md border ${goals.some(g => g.type === '短期') ? 'border-green-400/30 bg-green-500/10' : 'border-indigo-400/20 bg-indigo-500/10'}`}>
              <h4 className="font-semibold text-indigo-100">短期目標</h4>
              <p className="text-xs mt-1">3ヶ月以内に達成したい目標</p>
            </div>
            <div className={`p-3 rounded-md border ${goals.some(g => g.type === '中期') ? 'border-green-400/30 bg-green-500/10' : 'border-indigo-400/20 bg-indigo-500/10'}`}>
              <h4 className="font-semibold text-indigo-100">中期目標</h4>
              <p className="text-xs mt-1">1年以内に達成したい目標</p>
            </div>
            <div className={`p-3 rounded-md border ${goals.some(g => g.type === '長期') ? 'border-green-400/30 bg-green-500/10' : 'border-indigo-400/20 bg-indigo-500/10'}`}>
              <h4 className="font-semibold text-indigo-100">長期目標</h4>
              <p className="text-xs mt-1">3〜5年で達成したい目標</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-32">
            <select
              value={newGoal.type}
              onChange={e => setNewGoal(prev => ({ ...prev, type: e.target.value as Goal['type'] }))}
              className="w-full bg-indigo-900/50 border border-indigo-400/20 rounded-md text-indigo-100 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {getAvailableGoalTypes().map(type => (
                <option key={type} value={type}>{type}目標</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <Input
              placeholder="目標を入力..."
              value={newGoal.content}
              onChange={e => setNewGoal(prev => ({ ...prev, content: e.target.value }))}
              className="bg-indigo-900/50 border-indigo-400/20 text-indigo-100 placeholder-indigo-300/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Button
            onClick={addGoal}
            disabled={!!getGoalTypeError()}
            className="bg-indigo-500/80 hover:bg-indigo-600/80 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingGoal !== null ? '更新' : '追加'}
          </Button>
        </div>
        {getGoalTypeError() && (
          <p className="text-amber-300/80 text-sm mt-2">
            {getGoalTypeError()}
          </p>
        )}

        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="p-3 bg-indigo-900/50 rounded-lg border border-indigo-400/20 flex justify-between items-center"
            >
              <span className={`text-indigo-200 px-4 py-2 rounded-full ${
                goal.type === '短期' ? 'bg-purple-500/20 border-2 border-purple-500' :
                goal.type === '中期' ? 'bg-indigo-500/20 border-2 border-indigo-500' :
                'bg-blue-500/20 border-2 border-blue-500'
              }`}>
                {goal.type}
              </span>
              <span className="text-indigo-100 flex-1 ml-4">{goal.content}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => editGoal(index)}
                  variant="ghost"
                  className="text-indigo-200 hover:text-indigo-100 hover:bg-indigo-500/20"
                >
                  編集
                </Button>
                <Button
                  onClick={() => deleteGoal(index)}
                  variant="ghost"
                  className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                >
                  削除
                </Button>
              </div>
            </div>
          ))}
        </div>

        {previewMindmap()}

        {goals.length > 0 && (
          <div className="space-y-4">
            <Button
              onClick={generateMindmap}
              disabled={isLoading || !hasAllGoalTypes()}
              className="w-full bg-gradient-to-r from-indigo-500/80 to-purple-500/80 hover:from-indigo-600/80 hover:to-purple-600/80 text-white disabled:opacity-50 disabled:cursor-not-allowed h-12 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>目標マップを生成中...</span>
                </div>
              ) : (
                "目標マップを生成する"
              )}
            </Button>
            {!hasAllGoalTypes() && (
              <p className="text-amber-300/80 text-center text-sm">
                すべての種類の目標（短期・中期・長期）を設定してください
              </p>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
} 
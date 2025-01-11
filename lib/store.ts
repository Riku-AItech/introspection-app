import { create } from 'zustand';

interface LifeEvent {
  age: number;
  happiness: number;
  description: string;
}

interface Goal {
  type: '短期' | '中期' | '長期';
  content: string;
}

interface MindMapNode {
  id: string;
  type: string;
  label: string;
  position?: { x: number; y: number };
  parent?: string;
}

interface MindMapData {
  nodes: MindMapNode[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
}

interface AppState {
  // 人生の軌跡データ
  lifeEvents: LifeEvent[];
  setLifeEvents: (events: LifeEvent[]) => void;
  
  // 生成された詩
  poem: string;
  setPoem: (poem: string) => void;
  
  // 目標とマインドマップ
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  mindmap: MindMapData | null;
  setMindmap: (mindmap: MindMapData | null) => void;
  mindmapContent: string | null;
  setMindmapContent: (content: string | null) => void;
  
  // 状態のリセット
  resetStore: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  lifeEvents: [],
  setLifeEvents: (events) => set({ lifeEvents: events }),
  
  poem: '',
  setPoem: (poem) => set({ poem }),
  
  goals: [],
  setGoals: (goals) => set({ goals }),
  mindmap: null,
  setMindmap: (mindmap) => set({ mindmap }),
  mindmapContent: null,
  setMindmapContent: (content) => set({ mindmapContent: content }),
  
  resetStore: () => set({
    lifeEvents: [],
    poem: '',
    goals: [],
    mindmap: null,
    mindmapContent: null,
  }),
})); 
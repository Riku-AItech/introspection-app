'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LifeEvent {
  age: number;
  happiness: number;
  description: string;
}

export function LifeRoadmap() {
  const router = useRouter();
  const { lifeEvents, setLifeEvents } = useAppStore();
  const [newEvent, setNewEvent] = useState<LifeEvent>({
    age: 0,
    happiness: 50,
    description: ''
  });

  const addEvent = () => {
    if (newEvent.age >= 0 && newEvent.description) {
      setLifeEvents([...lifeEvents, newEvent].sort((a, b) => a.age - b.age));
      setNewEvent({ age: 0, happiness: 50, description: '' });
    }
  };

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
        title: {
          display: true,
          text: '人生の満足度（%）',
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        title: {
          display: true,
          text: '年齢',
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const event = lifeEvents[context.dataIndex];
            return [
              `満足度: ${event.happiness}`,
              `出来事: ${event.description}`
            ];
          }
        }
      }
    }
  };

  const handleReflection = () => {
    if (lifeEvents.length > 0) {
      router.push('/goal-setting');
    }
  };

  return (
    <CardContent className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-indigo-400/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-200">人生の出来事を追加</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-24">
                  <label className="block text-sm text-indigo-200 mb-1">年齢</label>
                  <Input
                    type="number"
                    placeholder="年齢"
                    value={newEvent.age}
                    onChange={e => {
                      const value = e.target.value;
                      const age = value === '' ? 0 : parseInt(value);
                      if (age >= 0 && age <= 100) {
                        setNewEvent(prev => ({ ...prev, age }));
                      }
                    }}
                    onClick={e => e.currentTarget.select()}
                    min="0"
                    max="100"
                    className="bg-white/5 border-indigo-400/20 text-indigo-100 cursor-text"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-indigo-200 mb-1">満足度</label>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={newEvent.happiness}
                    onChange={e => setNewEvent(prev => ({ ...prev, happiness: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-indigo-200 mt-1">
                    満足度: {newEvent.happiness}%
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-1">出来事の説明</label>
                <Input
                  placeholder="出来事の説明"
                  value={newEvent.description}
                  onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/5 border-indigo-400/20 text-indigo-100"
                />
              </div>
              <Button
                onClick={addEvent}
                className="w-full bg-indigo-500/80 hover:bg-indigo-600/80 text-white"
              >
                追加
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-indigo-400/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-200">登録された出来事</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {lifeEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/5 rounded-lg border border-indigo-400/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-200">{event.age}歳</span>
                    <span className="text-indigo-200">満足度: {event.happiness}</span>
                  </div>
                  <p className="text-indigo-100 mt-1">{event.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-indigo-400/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-200">人生の軌跡</h3>
          <div className="w-full h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleReflection}
          disabled={lifeEvents.length === 0}
          className="bg-gradient-to-r from-indigo-500/80 to-purple-500/80 hover:from-indigo-600/80 hover:to-purple-600/80 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          未来の目標を設定する
        </Button>
      </div>
    </CardContent>
  );
} 
import { NextResponse } from 'next/server';
import { DeepseekChat } from '@/lib/deepseek';

const deepseek = new DeepseekChat();

export async function POST(req: Request) {
  try {
    const { goals } = await req.json();

    // 生成AIへのプロンプト作成
    const prompt = `
以下の目標に基づいて、目標達成のためのマインドマップを生成してください。
各目標は短期、中期、長期に分類されています。
それぞれの目標に対して、達成するために必要なステップやアクションを階層的に提案してください。

目標リスト：
${goals.map((goal: any) => `${goal.type}: ${goal.content}`).join('\n')}

マインドマップは以下の形式のJSONで返してください：
{
  "id": "root",
  "content": "目標達成への道のり",
  "children": [
    {
      "id": "goal-1",
      "content": "目標1",
      "children": [
        {
          "id": "step-1",
          "content": "必要なステップ1",
          "children": []
        }
      ]
    }
  ]
}
`;

    // 生成AIからの応答を取得
    const response = await deepseek.chat(prompt);
    
    // JSON文字列を抽出
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('マインドマップの生成に失敗しました');
    }

    const mindmap = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ mindmap });
  } catch (error) {
    console.error('Error generating mindmap:', error);
    return NextResponse.json(
      { error: 'マインドマップの生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 
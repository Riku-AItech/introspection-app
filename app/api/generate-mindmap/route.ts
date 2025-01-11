import { NextResponse } from 'next/server';
import { DeepseekChat } from '@/lib/deepseek';

let deepseek: DeepseekChat;

try {
  deepseek = new DeepseekChat();
} catch (error) {
  console.error('Error initializing Deepseek client:', error);
  throw new Error('APIクライアントの初期化に失敗しました');
}

export async function POST(req: Request) {
  try {
    const { goals } = await req.json();
    console.log('受け取った目標:', goals);

    const prompt = `
あなたは目標達成のための道筋を提案するエキスパートです。
以下の目標に基づいて、具体的な実行ステップを提案してください。
各目標に対して3-4個の具体的なステップを提案してください。

目標:
${goals.map((goal: any) => `${goal.type}: ${goal.content}`).join('\n')}

以下の形式で、マインドマップのノードデータをJSON形式で出力してください：

{
  "nodes": [
    {
      "id": "root",
      "type": "root",
      "label": "目標達成への道のり"
    },
    {
      "id": "goal-long",
      "type": "goal",
      "label": "長期目標: [目標内容]",
      "parent": "root"
    },
    {
      "id": "long-step-1",
      "type": "step",
      "label": "ステップ1: [具体的なアクション]",
      "parent": "goal-long"
    }
  ]
}

注意点：
1. 各目標（長期・中期・短期）に対して、具体的で実行可能なステップを提案してください
2. ステップは具体的な行動として記述してください
3. 各ステップには期限や数値目標を含めてください
4. 目標間の関連性を考慮してステップを設定してください
5. 必ずJSONとして解析可能な形式で出力してください

JSONのみを出力し、それ以外の説明は含めないでください。`;

    console.log('DeepSeekにプロンプトを送信します');
    const response = await deepseek.chat(prompt);
    console.log('DeepSeekからの応答を受信しました:', response);

    try {
      const jsonStr = response.replace(/```json\n|\n```/g, '').trim();
      console.log('整形されたJSON文字列:', jsonStr);
      
      const mindmapData = JSON.parse(jsonStr);
      console.log('生成されたマインドマップデータ:', mindmapData);

      if (!mindmapData.nodes || !Array.isArray(mindmapData.nodes)) {
        throw new Error('不正なマインドマップデータ形式です');
      }

      return NextResponse.json({
        success: true,
        data: mindmapData,
      });
    } catch (error) {
      console.error('JSONのパースに失敗:', error);
      return NextResponse.json({
        success: false,
        error: 'マインドマップデータの生成に失敗しました',
        details: response, // デバッグ用にDeepSeekの生の応答を含める
      });
    }
  } catch (error) {
    console.error('Error generating mindmap:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'マインドマップの生成中にエラーが発生しました',
    });
  }
} 
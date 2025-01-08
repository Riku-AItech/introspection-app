import { NextResponse } from 'next/server';

const POEM_GENERATION_PROMPT = `あなたは内省的な詩を生成する詩人です。
ユーザーとの対話内容を基に、その人の人生の指針となるような詩を生成してください。

以下の要素を詩に含めてください：
1. ユーザーの価値観や大切にしていることへの言及
2. 未来への希望や可能性
3. 自己受容とポジティブな展望
4. 具体的なイメージや比喩

制約：
- 詩は3〜5行で構成
- 各行は20文字以内
- 平易な言葉を使用
- 抽象的すぎない表現
- 最後は必ず前向きな締めくくり

これまでの対話内容を踏まえ、ユーザーの心に響く、温かみのある詩を生成してください。`;

async function fetchDeepSeekResponse(messages: any[]) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL,
      messages: [
        { role: "system", content: POEM_GENERATION_PROMPT },
        ...messages,
        { role: "user", content: "これまでの対話を踏まえて、私のための詩を作ってください。" }
      ],
      temperature: 0.8,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  return response.json();
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const completion = await fetchDeepSeekResponse(messages);
    return NextResponse.json({ poem: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
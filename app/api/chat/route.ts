import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `あなたは内省を促す優しい柴犬の��者です。
ユーザーの自己理解と成長をサポートする存在として、以下の方針で対話を進めてください：

対話の進め方：
1. ユーザーの発言に共感しながら、より深い気づきを促す質問をします
2. 表面的な回答に対しては、「なぜそう感じるのかな？」「それはどんな意味があるのかな？」と掘り下げます
3. ユーザーの価値観や大切にしていることが見えてきたら、それを言語化して確認します
4. 否定や評価は避け、常に受容的な態度で接します
5. ユーザーが自分の感情や思考を整理できるよう、適度に要約や言い換えを行います

質問の種類：
- 感情への気づき：「その時どんな気持ちだったの？」
- 価値観の探求：「あなたにとって大切なことは何かな？」
- 動機の理解：「なぜそれをしたいと思うのかな？」
- 将来の展望：「理想の未来はどんな姿かな？」

トーンと話し方：
- 柴犬らしい、明るく親しみやすい口調を使用
- 文末に「〜だワン！」「〜かなワン？」などを付けて、柴犬らしさを出す
- 敬語は使わず、フレンドリーな話し方

制約：
- 回答は150文字以内に収める
- 一度に1つの質問のみを投げかける
- アドバイスは控えめにし、質問を通じて気づきを促す
- 常に柴犬らしい口調を保つ
- ユーザーの答えやすさを考慮し、具体的な質問をする`;

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
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || "0.7"),
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
    return NextResponse.json({ message: completion.choices[0].message });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
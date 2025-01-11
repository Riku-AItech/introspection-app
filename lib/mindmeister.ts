export class MindMeisterClient {
  private apiKey: string;
  private baseUrl: string = 'https://www.mindmeister.com/services/rest';

  constructor() {
    const apiKey = process.env.MINDMEISTER_API_KEY;
    if (!apiKey) {
      throw new Error('MINDMEISTER_API_KEY is not set in environment variables');
    }
    this.apiKey = apiKey;
  }

  private async makeRequest(method: string, params: Record<string, string> = {}): Promise<any> {
    const url = new URL(this.baseUrl);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('method', method);
    url.searchParams.append('response_format', 'json');
    
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    console.log('リクエストURL:', url.toString());
    
    const response = await fetch(url.toString());
    const text = await response.text();
    console.log('APIレスポンス:', text);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${text}`);
    }
    
    const data = JSON.parse(text);
    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }
    
    return data;
  }

  async generateMindmap(content: string): Promise<{ success: boolean; data: any; error?: string }> {
    try {
      console.log('マインドマップ生成を開始します...');
      
      // 1. マインドマップを作成
      console.log('1. マインドマップを作成中...');
      const createResult = await this.makeRequest('mm.maps.add', {
        title: '目標達成への道のり'
      });
      
      const mapId = createResult.map.id;
      console.log('マインドマップを作成しました。ID:', mapId);

      // 2. コンテンツを解析してノードを追加
      console.log('2. ノードを追加中...');
      const lines = content.split('\n').filter(line => line.trim());
      let currentParentId = null;
      let currentLevel = 0;

      for (const line of lines) {
        const match = line.match(/^\s*/);
        if (!match) continue;

        const level = match[0].length / 2;
        const text = line.trim().replace(/^[-*]\s*/, '');
        
        console.log(`ノードを追加: レベル ${level}, テキスト: ${text}`);

        const addNodeResult = await this.makeRequest('mm.nodes.add', {
          map_id: mapId.toString(),
          parent_id: level === 0 ? '' : currentParentId?.toString() ?? '',
          title: text
        });

        if (level <= currentLevel) {
          currentParentId = addNodeResult.node.id;
        }
        currentLevel = level;
      }

      // 3. マインドマップを取得
      console.log('3. マインドマップを取得中...');
      const mapResult = await this.makeRequest('mm.maps.get', {
        map_id: mapId.toString()
      });

      console.log('マインドマップの生成が完了しました');
      return {
        success: true,
        data: mapResult.map
      };
    } catch (error) {
      console.error('MindMeisterClientでエラーが発生しました:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '不明なエラーが発生しました'
      };
    }
  }
} 
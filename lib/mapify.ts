export class MapifyClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.mapify.ai/v1';

  constructor() {
    const apiKey = process.env.MAPIFY_API_KEY;
    if (!apiKey) {
      throw new Error('MAPIFY_API_KEY is not set in environment variables');
    }
    this.apiKey = apiKey;
  }

  async generateMindmap(content: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/mindmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          content,
          style: 'modern',
          format: 'svg'
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.svg;
    } catch (error) {
      console.error('Error in MapifyClient:', error);
      throw error;
    }
  }
} 
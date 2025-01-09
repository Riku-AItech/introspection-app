'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function GoalForm({ onSubmit }: { onSubmit: (goal: { type: string; text: string }) => void }) {
  const [type, setType] = useState('short')
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ type, text })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goal-type">目標期間</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">短期 (1年以内)</SelectItem>
            <SelectItem value="medium">中期 (1-3年)</SelectItem>
            <SelectItem value="long">長期 (3年以上)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-text">目標内容</Label>
        <Input
          id="goal-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="達成したい目標を入力"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        目標を設定
      </Button>
    </form>
  )
}

"use client"
import { useState, useRef, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export default function TagInput({ value, onChange, placeholder = "输入标签后回车添加", maxTags = 20 }: TagInputProps) {
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (!tag) return
    if (value.includes(tag)) return
    if (value.length >= maxTags) {
      setError(`最多 ${maxTags} 个标签`)
      return
    }
    onChange([...value, tag])
    setInput("")
    if (error) setError(null)
  }

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag))
    if (error) setError(null)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && value.length) {
      // 快捷删除最后一个
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2">
      {value.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 border border-gray-300 text-gray-600 rounded-full px-2 py-0.5 text-xs"
        >
          {tag}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
            onClick={() => removeTag(tag)}
            aria-label={`删除 ${tag}`}
          >
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 150.6c12.5 12.5 12.5 32.8 0 45.3L205.3 301.3 310.6 406.6c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L160 346.7 54.6 452c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L114.7 301.3 9.4 195.9C-3.1 183.4-3.1 163 9.4 150.6s32.8-12.5 45.3 0L160 256.7 265.4 150.6c12.5-12.5 32.8-12.5 45.2 0z" /></svg>
          </Button>
        </span>
      ))}
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`h-7 flex-1 min-w-[160px] ${error ? 'border-red-500 focus-visible:border-red-500 ring-1 ring-red-500/20' : 'border-transparent focus-visible:border-border focus-visible:ring-0'}`}
      />
      {error && (
        <div className="w-full text-xs text-red-600 mt-1">{error}</div>
      )}
    </div>
  )
}

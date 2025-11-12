"use client"
import { useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import type { ModuleContentElement, JSONContent } from "@/types/resume"
import { useToolbarManager } from "./rich-text-toolbar-manager"

interface RichTextInputProps {
  element: ModuleContentElement
  onChange: (updates: Partial<ModuleContentElement>) => void
  placeholder?: string
  showBorder?: boolean
}

// Custom extension for font size
const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: Record<string, unknown>) => {
              const fontSize = typeof attributes.fontSize === 'string' ? attributes.fontSize : null;
              if (!fontSize) {
                return {}
              }
              return {
                style: `font-size: ${fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
})

// Preserve newlines when pasting plain text: split into paragraphs
const PlainTextPaste = Extension.create({
  name: 'plainTextPaste',
  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        props: {
          handlePaste(_: EditorView, event: ClipboardEvent) {
            const e = event as ClipboardEvent
            const cd = e?.clipboardData
            if (!cd) return false
            const html = cd.getData('text/html') || ''
            const text = cd.getData('text/plain') || ''
            // If HTML contains semantic blocks, let default handler run
            if (html && /<(p|br|div|ul|ol|li)\b/i.test(html)) return false
            if (!text || !/\r?\n/.test(text)) return false
            e.preventDefault()
            const lines = text.replace(/\r\n?/g, '\n').split('\n')
            const content = lines.map((line) => (
              line
                ? { type: 'paragraph', content: [{ type: 'text', text: line }] }
                : { type: 'paragraph' }
            ))
            editor.chain().focus().insertContent(content).run()
            return true
          },
        },
      }),
    ]
  },
})

// Default empty content
const getDefaultContent = (): JSONContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
})

export default function RichTextInput({
  element,
  onChange,
  placeholder = "输入内容...",
  showBorder = true
}: RichTextInputProps) {
  const { registerEditor, unregisterEditor } = useToolbarManager()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        // 禁用 TrailingNode 与 Dropcursor，避免在列表转换后自动追加空段落
        trailingNode: false,
        dropcursor: false,
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      PlainTextPaste,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      TextAlign.configure({
        types: ['paragraph'],
      }),
    ],
    content: element.content || getDefaultContent(),
    editorProps: {
      attributes: {
        class: `rt-editor min-h-[40px] px-3 py-2 focus:outline-none ${showBorder ? 'border border-dashed border-teal-200 focus-within:border-teal-300' : ''
          }`,
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange({ content: json })
    },
  })

  // Register editor with toolbar manager
  useEffect(() => {
    if (!editor) return

    const cleanup = registerEditor(editor)
    return () => {
      if (cleanup) cleanup()
      unregisterEditor(editor)
    }
  }, [editor, registerEditor, unregisterEditor])

  // Update editor content when element changes externally
  useEffect(() => {
    if (!editor) return

    const currentJson = editor.getJSON()
    const newJson = element.content || getDefaultContent()

    // Only update if content actually changed to avoid cursor jumping
    if (JSON.stringify(currentJson) !== JSON.stringify(newJson)) {
      editor.commands.setContent(newJson)
    }
  }, [editor, element.content, element.id]) // Update when editor or content/id changes

  if (!editor) {
    return null
  }

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        placeholder={placeholder}
      />
    </div>
  )
}

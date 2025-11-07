"use client"

import type React from "react"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Icon } from "@iconify/react"
import type { ResumeData, EditorState } from "@/types/resume"
import { exportToMagicyanFile, downloadFile, importFromMagicyanFile } from "@/lib/resume-utils"
import ResumePreview from "./resume-preview"
import PersonalInfoEditor from "./personal-info-editor"
import ModuleEditor from "./module-editor"
import PDFExportButton from "./pdf-export-button"

type ViewMode = "both" | "edit-only" | "preview-only"

const ViewModeSelector = memo(
  ({
    viewMode,
    onViewModeChange,
  }: {
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
  }) => {
    const modes = [
      { key: "both" as ViewMode, label: "编辑+预览", icon: "mdi:view-split-vertical" },
      { key: "edit-only" as ViewMode, label: "仅编辑", icon: "mdi:pencil" },
      { key: "preview-only" as ViewMode, label: "仅预览", icon: "mdi:eye" },
    ]

    return (
      <div className="relative inline-flex bg-muted rounded-lg p-1">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onViewModeChange(mode.key)}
            className={`
            relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            flex items-center gap-2 min-w-[100px] justify-center
            ${viewMode === mode.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }
          `}
          >
            <Icon icon={mode.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>
    )
  },
)

ViewModeSelector.displayName = "ViewModeSelector"

/**
 * 简历构建器主组件
 */
export default function ResumeBuilder() {
  const [editorState, setEditorState] = useState<EditorState>({
    resumeData: {
      title: "加载中...",
      personalInfoSection: {
        personalInfo: [],
        showPersonalInfoLabels: true,
      },
      avatar: "",
      modules: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    isEditing: true,
    showPreview: true,
  })

  const [viewMode, setViewMode] = useState<ViewMode>("both")

  const { toast } = useToast()

  useEffect(() => {
    const loadDemoData = async () => {
      try {
        const response = await fetch("/demo.magicyan")
        if (!response.ok) {
          throw new Error("Failed to load demo data")
        }
        const content = await response.text()
        const demoData = importFromMagicyanFile(content)

        setEditorState((prev) => ({
          ...prev,
          resumeData: demoData,
        }))
      } catch (error) {
        console.error("加载示例数据失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载示例简历数据，请刷新页面重试",
          variant: "destructive",
        })
      }
    }

    loadDemoData()
  }, [toast])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])

  const updateResumeData = useCallback((updates: Partial<ResumeData>) => {
    setEditorState((prev) => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }, [])

  // toggleShowLabels function has been moved to PersonalInfoEditor component
  // to handle the personalInfoSection showPersonalInfoLabels state locally

  const handleSave = () => {
    try {
      const fileContent = exportToMagicyanFile(editorState.resumeData)
      const filename = `${editorState.resumeData.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")}.magicyan`
      downloadFile(fileContent, filename)

      toast({
        title: "保存成功",
        description: `简历已保存为 ${filename}`,
      })
    } catch (error) {
      console.error("保存失败:", error)
      toast({
        title: "保存失败",
        description: "文件保存时发生错误，请重试",
        variant: "destructive",
      })
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".magicyan")) {
      toast({
        title: "文件格式错误",
        description: "请选择 .magicyan 格式的文件",
        variant: "destructive",
      })
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "文件大小不能超过 5MB",
        variant: "destructive",
      })
      event.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = importFromMagicyanFile(content)

        setEditorState((prev) => ({
          ...prev,
          resumeData: importedData,
        }))

        toast({
          title: "导入成功",
          description: `已成功导入简历：${importedData.title}`,
        })
      } catch (error) {
        console.error("导入文件失败:", error)
        toast({
          title: "导入失败",
          description: error instanceof Error ? error.message : "文件解析失败，请检查文件格式",
          variant: "destructive",
        })
      }
    }

    reader.onerror = () => {
      toast({
        title: "读取失败",
        description: "无法读取文件，请重试",
      })
    }

    reader.readAsText(file)

    event.target.value = ""
  }

  // PDF 导出功能现在由 PDFExportButton 组件处理

  return (
    <div className="resume-editor">
      {/* 工具栏 */}
      <div className="editor-toolbar">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:file-document-edit" className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">简历生成器</h1>
          </div>
          <Badge variant="secondary" className="text-xs">
            {editorState.resumeData.title}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <ViewModeSelector viewMode={viewMode} onViewModeChange={handleViewModeChange} />

          <Separator orientation="vertical" className="h-6" />

          <input type="file" accept=".magicyan" onChange={handleImport} className="hidden" id="import-file" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("import-file")?.click()}
            className="gap-2 bg-transparent"
          >
            <Icon icon="mdi:import" className="w-4 h-4" />
            导入
          </Button>

          <Button variant="outline" size="sm" onClick={handleSave} className="gap-2 bg-transparent">
            <Icon icon="mdi:content-save" className="w-4 h-4" />
            保存
          </Button>

          <PDFExportButton
            resumeData={editorState.resumeData}
            size="sm"
          />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="editor-content">
        {/* 编辑面板 */}
        {(viewMode === "both" || viewMode === "edit-only") && (
          <div className={`editor-panel ${viewMode === "edit-only" ? "w-full" : ""}`}>
            <div className="p-6 space-y-6">
              {/* 简历标题编辑 */}
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:format-title" className="w-5 h-5 text-primary" />
                    <h2 className="font-medium">简历标题</h2>
                  </div>
                  <Input
                    value={editorState.resumeData.title}
                    onChange={(e) => updateResumeData({ title: e.target.value })}
                    placeholder="请输入简历标题或姓名"
                    className="text-lg font-medium"
                  />
                </div>
              </Card>

              {/* 个人信息编辑 */}
              <PersonalInfoEditor
                personalInfoSection={editorState.resumeData.personalInfoSection}
                avatar={editorState.resumeData.avatar}
                onUpdate={(personalInfoSection, avatar) => updateResumeData({ personalInfoSection, avatar })}
              />

              {/* 简历模块编辑 */}
              <ModuleEditor
                modules={editorState.resumeData.modules}
                onUpdate={(modules) => updateResumeData({ modules })}
              />
            </div>
          </div>
        )}

        {/* 预览面板 */}
        {(viewMode === "both" || viewMode === "preview-only") && (
          <div className={`preview-panel ${viewMode === "preview-only" ? "w-full" : ""}`}>
            <ResumePreview resumeData={editorState.resumeData} />
          </div>
        )}
      </div>
    </div>
  )
}

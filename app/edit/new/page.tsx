"use client"

import { Suspense, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ResumeBuilder from "@/components/resume-builder"
import type { ResumeData } from "@/types/resume"
import { createEntryFromData, StorageError, getResumeById } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function NewEditPage() {
  // 包裹 Suspense 以满足 useSearchParams 的要求，fallback 为空避免“加载中...”
  return (
    <Suspense fallback={null}>
      <NewEditPageContent />
    </Suspense>
  )
}

function NewEditPageContent() {
  const router = useRouter()
  const search = useSearchParams()
  const { toast } = useToast()

  const cloneId = search.get("clone")
  const useExample = search.get("example") === "1" || search.get("example") === "true"

  // 从 sessionStorage 恢复用户中心预加载的数据
  const prefetchedData: ResumeData | undefined = useMemo(() => {
    if (typeof window === "undefined") return undefined
    try {
      const raw = sessionStorage.getItem("new-edit-initial-data")
      if (!raw) return undefined
      const parsed = JSON.parse(raw) as ResumeData
      sessionStorage.removeItem("new-edit-initial-data")
      return parsed
    } catch {
      return undefined
    }
  }, [])

  // 同步派生克隆数据；在 SSR 阶段返回 undefined，客户端首帧即可拿到
  const clonedData: ResumeData | undefined = useMemo(() => {
    if (!cloneId) return undefined
    if (typeof window === "undefined") return undefined
    const entry = getResumeById(cloneId)
    return entry ? { ...entry.resumeData } : undefined
  }, [cloneId])

  const handleSave = async (current: ResumeData) => {
    try {
      const entry = createEntryFromData(current)
      toast({ title: "保存成功", description: `已创建：${entry.resumeData.title}` })
      router.replace(`/edit/${entry.id}`)
    } catch (e: unknown) {
      if (e instanceof StorageError && e.code === "QUOTA_EXCEEDED") {
        toast({
          title: "保存失败：存储空间不足",
          description: "请删除一些旧的简历，或导出为 JSON 后清理存储。",
          variant: "destructive",
        })
      } else {
        const message = e instanceof Error ? e.message : "未知错误"
        toast({ title: "保存失败", description: message, variant: "destructive" })
      }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <ResumeBuilder
        // 优先使用：克隆数据 > 预加载数据
        initialData={clonedData ?? prefetchedData}
        template={useExample ? "example" : "default"}
        onBack={() => router.push("/")}
        onSave={(d) => handleSave(d)}
      />
    </main>
  )
}

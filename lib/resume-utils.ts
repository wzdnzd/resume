import type { ResumeData, MagicyanFile, ResumeModule, PersonalInfoItem } from "@/types/resume"


/**
 * 创建新的简历模块
 */
export function createNewModule(order: number): ResumeModule {
  return {
    id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: "新模块",
    subtitle: "",
    timeRange: "",
    content: "",
    icon: "mdi:text-box",
    order,
  }
}

/**
 * 创建新的个人信息项
 */
export function createNewPersonalInfoItem(): PersonalInfoItem {
  return {
    id: `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    label: "新标签，如：电话、邮箱等",
    value: {
      content: "",
      type: "text",
    },
    icon: "mdi:information",
  }
}

/**
 * 导出简历数据为.magicyan文件
 */
export function exportToMagicyanFile(resumeData: ResumeData): string {
  const magicyanFile: MagicyanFile = {
    version: "1.0.0",
    data: {
      ...resumeData,
      updatedAt: new Date().toISOString(),
    },
    metadata: {
      exportedAt: new Date().toISOString(),
      appVersion: "1.0.0",
    },
  }

  return JSON.stringify(magicyanFile, null, 2)
}

/**
 * 从.magicyan文件内容导入简历数据
 */
export function importFromMagicyanFile(fileContent: string): ResumeData {
  try {
    if (!fileContent.trim()) {
      throw new Error("文件内容为空")
    }

    const magicyanFile: MagicyanFile = JSON.parse(fileContent)

    if (!magicyanFile || typeof magicyanFile !== "object") {
      throw new Error("无效的文件格式")
    }

    if (!magicyanFile.version) {
      throw new Error("缺少版本信息")
    }

    if (!magicyanFile.data) {
      throw new Error("缺少简历数据")
    }

    const data = magicyanFile.data
    if (!data.title || typeof data.title !== "string") {
      throw new Error("简历标题格式错误")
    }

    if (!data.personalInfoSection || !Array.isArray(data.personalInfoSection.personalInfo)) {
      throw new Error("个人信息格式错误")
    }

    if (!Array.isArray(data.modules)) {
      throw new Error("简历模块格式错误")
    }

    for (const item of data.personalInfoSection.personalInfo) {
      if (!item.id || !item.label || typeof item.value !== "object") {
        throw new Error("个人信息项格式错误")
      }
    }

    for (const module of data.modules) {
      if (!module.id || typeof module.title !== "string" || typeof module.order !== "number") {
        throw new Error("简历模块格式错误")
      }
    }

    const now = new Date().toISOString()
    return {
      ...data,
      personalInfoSection: {
        personalInfo: data.personalInfoSection?.personalInfo || [],
        showPersonalInfoLabels: data.personalInfoSection?.showPersonalInfoLabels !== undefined ? data.personalInfoSection.showPersonalInfoLabels : true,
      },
      createdAt: data.createdAt || now,
      updatedAt: now,
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("文件格式不正确，请确保是有效的JSON文件")
    }
    throw error
  }
}

/**
 * 下载文件到本地
 */
export function downloadFile(content: string, filename: string, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 生成PDF文件名
 */
export function generatePdfFilename(resumeTitle: string): string {
  const timestamp = new Date().toISOString().slice(0, 10)
  const cleanTitle = resumeTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")
  return `${cleanTitle}_${timestamp}.pdf`
}




/**
 * 验证简历数据完整性
 */
export function validateResumeData(data: ResumeData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push("简历标题不能为空")
  }

  if (!data.personalInfoSection || !Array.isArray(data.personalInfoSection.personalInfo)) {
    errors.push("个人信息格式错误")
  } else {
    data.personalInfoSection.personalInfo.forEach((item, index) => {
      if (!item.id || !item.label?.trim()) {
        errors.push(`个人信息第${index + 1}项格式错误`)
      }
    })
  }

  if (!Array.isArray(data.modules)) {
    errors.push("简历模块格式错误")
  } else {
    data.modules.forEach((module, index) => {
      if (!module.id || typeof module.title !== "string") {
        errors.push(`简历模块第${index + 1}项格式错误`)
      }
    })
  }

  // 验证showPersonalInfoLabels属性（可选）
  if (data.personalInfoSection?.showPersonalInfoLabels !== undefined && typeof data.personalInfoSection.showPersonalInfoLabels !== "boolean") {
    errors.push("显示个人信息标签设置格式错误")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

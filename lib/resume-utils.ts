import type { ResumeData, ResumeFile, ResumeModule, PersonalInfoItem, JobIntentionItem } from "@/types/resume"

/**
 * 生成默认的简历数据
 */
export function createDefaultResumeData(): ResumeData {
  const now = new Date().toISOString()

  return {
    title: "我的简历",
    centerTitle: true,
    personalInfoSection: {
      personalInfo: [
        {
          id: "phone",
          label: "电话",
          value: {
            content: "138xxxx8888",
            type: "text"
          },
          icon: "<path fill=\"currentColor\" d=\"M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z\"/>",
          order: 0
        },
        {
          id: "email",
          label: "邮箱",
          value: {
            content: "example@email.com",
            type: "text"
          },
          icon: "<path fill=\"currentColor\" d=\"m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2\"/>",
          order: 1
        }
      ],
      showPersonalInfoLabels: false,
      layout: {
        mode: 'grid',
        itemsPerRow: 2
      }
    },
    jobIntentionSection: {
      items: [
        {
          id: "jii-1",
          label: "工作经验",
          value: "3年",
          order: 0,
          type: "workYears"
        },
        {
          id: "jii-2",
          label: "求职意向",
          value: "前端工程师",
          order: 1,
          type: "position"
        }
      ],
      enabled: true
    },
    modules: [
      {
        id: "education-1",
        title: "教育背景",
        icon: "<path fill=\"currentColor\" d=\"M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17z\"/>",
        order: 0,
        rows: [
          {
            id: "edu-row-1",
            columns: 3,
            elements: [
              {
                id: "edu-elem-1",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "XX大学"
                        }
                      ],
                      attrs: {
                        textAlign: "left"
                      }
                    }
                  ]
                },
                columnIndex: 0
              },
              {
                id: "edu-elem-2",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "计算机科学与技术"
                        }
                      ],
                      attrs: {
                        textAlign: "center"
                      }
                    }
                  ]
                },
                columnIndex: 1
              },
              {
                id: "edu-elem-3",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "2018.09 - 2022.06"
                        }
                      ],
                      attrs: {
                        textAlign: "right"
                      }
                    }
                  ]
                },
                columnIndex: 2
              }
            ],
            order: 0
          }
        ]
      },
      {
        id: "work-1",
        title: "工作经历",
        icon: "<path fill=\"currentColor\" d=\"M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8c0-1.11.89-2 2-2h4V4c0-1.11.89-2 2-2m4 4V4h-4v2z\"/>",
        order: 1,
        rows: [
          {
            id: "work-row-1",
            columns: 3,
            elements: [
              {
                id: "work-elem-1",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "XX科技公司"
                        }
                      ],
                      attrs: {
                        textAlign: "left"
                      }
                    }
                  ]
                },
                columnIndex: 0
              },
              {
                id: "work-elem-2",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "前端工程师"
                        }
                      ],
                      attrs: {
                        textAlign: "center"
                      }
                    }
                  ]
                },
                columnIndex: 1
              },
              {
                id: "work-elem-3",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "2022.07 - 至今"
                        }
                      ],
                      attrs: {
                        textAlign: "right"
                      }
                    }
                  ]
                },
                columnIndex: 2
              }
            ],
            order: 0
          },
          {
            id: "work-row-2",
            columns: 1,
            elements: [
              {
                id: "work-elem-4",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "负责公司核心产品的前端开发工作，使用 React、TypeScript 等技术栈。"
                        }
                      ],
                      attrs: {
                        textAlign: "left"
                      }
                    }
                  ]
                },
                columnIndex: 0
              }
            ],
            order: 1
          }
        ]
      }
    ],
    avatar: "",
    createdAt: now,
    updatedAt: now
  }
}

/**
 * 创建新的简历模块
 */
export function createNewModule(order: number): ResumeModule {
  return {
    id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: "新模块",
    icon: undefined,
    order,
    rows: [],
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
    order: 0,
  }
}

/**
 * 创建新的求职意向项
 */
export function createNewJobIntentionItem(type: 'workYears' | 'position' | 'city' | 'salary' | 'custom', order: number): JobIntentionItem {
  const labels = {
    workYears: '工作经验',
    position: '求职意向',
    city: '目标城市',
    salary: '期望薪资',
    custom: '自定义'
  }

  return {
    id: `jii-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    label: labels[type],
    value: '',
    order,
    type,
    salaryRange: type === 'salary' ? { min: undefined, max: undefined } : undefined
  }
}

/**
 * 导出简历数据为.re文件
 */
export function exportToMagicyanFile(resumeData: ResumeData): string {
  const magicyanFile: ResumeFile = {
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
 * 从.re文件内容导入简历数据
 */
export function importFromMagicyanFile(fileContent: string): ResumeData {
  if (!fileContent.trim()) {
    throw new Error("文件内容为空")
  }

  const magicyanFile: ResumeFile = JSON.parse(fileContent)

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

  for (const mod of data.modules) {
    if (!mod.id || typeof mod.title !== "string" || typeof mod.order !== "number") {
      throw new Error("简历模块格式错误")
    }
  }

  const now = new Date().toISOString()

  // 处理布局配置：优先使用新的layout属性
  let layout = data.personalInfoSection?.layout
  if (!layout) {
    layout = {
      mode: 'grid',
      itemsPerRow: 2
    }
  }

  return {
    ...data,
    personalInfoSection: {
      personalInfo: data.personalInfoSection?.personalInfo || [],
      showPersonalInfoLabels: data.personalInfoSection?.showPersonalInfoLabels !== undefined ? data.personalInfoSection.showPersonalInfoLabels : true,
      layout: layout,
    },
    createdAt: data.createdAt || now,
    updatedAt: now,
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
  const base = (resumeTitle || '').trim() || '未命名';
  const encoded = base.replace(/[\x00-\x7F]/g, (ch) => {
    // 保留 RFC3986 中的 unreserved: ALPHA / DIGIT / "-" / "." / "_" / "~"
    if (/[A-Za-z0-9\-_.~]/.test(ch)) return ch;
    // 其它 ASCII 字符进行编码（包含空格、斜杠等）
    return encodeURIComponent(ch);
  });
  const timestamp = new Date().toISOString().slice(0, 10)

  return `简历-${encoded}-${timestamp}.pdf`;
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

  // 验证showPersonalInfoLabels属性
  if (data.personalInfoSection?.showPersonalInfoLabels !== undefined && typeof data.personalInfoSection.showPersonalInfoLabels !== "boolean") {
    errors.push("显示个人信息标签设置格式错误")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

"use client";

import React, { useEffect, useState } from "react";
import type { ResumeData } from "@/types/resume";
import ResumePreview from "@/components/resume-preview";

export default function PrintContent({ initialData }: { initialData?: ResumeData | null }) {
  // Avoid accessing sessionStorage during SSR. Hydrate from initialData, then
  // read sessionStorage after mount so Puppeteer-injected data is picked up.
  const [resumeData, setResumeData] = useState<ResumeData | null>(initialData ?? null);
  useEffect(() => {
    if (resumeData) return; // already have data from URL param
    try {
      const s = sessionStorage.getItem("resumeData");
      if (s) {
        setResumeData(JSON.parse(s) as ResumeData);
      }
    } catch {}
  }, [resumeData]);

  return (
    <div className="pdf-preview-mode">
      {resumeData ? (
        <ResumePreview resumeData={resumeData} />
      ) : (
        <div className="resume-content p-8">
          <h1 className="text-xl font-bold mb-4">无法加载简历数据</h1>
          <p className="text-muted-foreground">请通过后端生成接口或附带 data 参数访问本页面。</p>
        </div>
      )}
    </div>
  );
}

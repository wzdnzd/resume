"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import type { ResumeData } from "@/types/resume";
import { generatePdfFilename } from "@/lib/resume-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  resumeData: ResumeData;
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

export function ExportButton({
  resumeData,
  variant = "default",
  size = "default",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportAsImage = async (format: "png" | "jpg" | "webp" | "svg") => {
    setIsExporting(true);

    try {
      const resumeElement = document.querySelector(".resume-preview") as HTMLElement;
      if (!resumeElement) {
        throw new Error("找不到简历预览元素");
      }

      if (format === "svg") {
        await exportAsSVG(resumeElement);
        return;
      }

      // 动态导入 html-to-image
      const htmlToImage = await import("html-to-image");

      // 根据格式选择对应的方法
      let dataUrl: string;
      const options = {
        quality: format === "jpg" ? 0.95 : 1,
        pixelRatio: 2, // 提高清晰度
        backgroundColor: "#ffffff",
      };

      switch (format) {
        case "png":
          dataUrl = await htmlToImage.toPng(resumeElement, options);
          break;
        case "jpg":
          dataUrl = await htmlToImage.toJpeg(resumeElement, options);
          break;
        case "webp":
          // html-to-image 没有直接的 toWebp 方法，使用 toBlob 然后转换
          const blob = await htmlToImage.toBlob(resumeElement, {
            ...options,
            type: "image/webp",
          });
          if (!blob) throw new Error("生成 WEBP 失败");
          dataUrl = URL.createObjectURL(blob);
          break;
        default:
          throw new Error("不支持的格式");
      }

      // 下载图片
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = generatePdfFilename(resumeData.title).replace(
        ".pdf",
        `.${format}`
      );
      link.click();

      // 清理 URL（如果是 blob URL）
      if (dataUrl.startsWith("blob:")) {
        URL.revokeObjectURL(dataUrl);
      }

      toast({
        title: "导出成功",
        description: `简历已导出为 ${format.toUpperCase()} 格式`,
      });
    } catch (e) {
      console.error("导出图片失败:", e);
      toast({
        title: "导出失败",
        description: "导出图片时发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsSVG = async (element: HTMLElement) => {
    try {
      // 使用 html-to-image 的 toSvg 方法
      const htmlToImage = await import("html-to-image");

      const dataUrl = await htmlToImage.toSvg(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });

      // 下载 SVG
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = generatePdfFilename(resumeData.title).replace(
        ".pdf",
        ".svg"
      );
      link.click();

      toast({
        title: "导出成功",
        description: "简历已导出为 SVG 格式",
      });
    } catch (error) {
      console.error("导出 SVG 失败:", error);
      throw error;
    }
  };

  const exportAsPDF = () => {
    const filename = generatePdfFilename(resumeData.title || "");
    const childWindow = window.open(`/pdf/preview/${filename}`, '_blank');
    if (!childWindow) {
      console.error('Failed to open popup window');
      toast({
        title: "导出失败",
        description: "无法打开 PDF 预览窗口，请检查浏览器弹窗设置",
        variant: "destructive",
      });
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.source === childWindow && event.data.type === 'ready') {
        childWindow.postMessage({ type: 'resumeData', data: resumeData }, '*');
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    // 设置超时，如果子窗口没有准备好
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
    }, 5000); // 5秒超时
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isExporting}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Icon icon="mdi:download" className="w-4 h-4" />
          {isExporting ? "导出中..." : "导出"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsPDF}>
          <Icon icon="mdi:file-pdf-box" className="w-4 h-4 mr-2" />
          PDF 格式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAsImage("png")}>
          <Icon icon="mdi:file-image" className="w-4 h-4 mr-2" />
          PNG 格式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAsImage("jpg")}>
          <Icon icon="mdi:file-jpg-box" className="w-4 h-4 mr-2" />
          JPG 格式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAsImage("webp")}>
          <Icon icon="mdi:file-image" className="w-4 h-4 mr-2" />
          WEBP 格式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAsImage("svg")}>
          <Icon icon="mdi:svg" className="w-4 h-4 mr-2" />
          SVG 格式
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExportButton;

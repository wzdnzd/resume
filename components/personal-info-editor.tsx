"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import type { PersonalInfoItem, PersonalInfoSection } from "@/types/resume";
import { createNewPersonalInfoItem } from "@/lib/resume-utils";
import IconPicker from "./icon-picker";

interface PersonalInfoEditorProps {
  personalInfoSection: PersonalInfoSection;
  avatar?: string;
  onUpdate: (personalInfoSection: PersonalInfoSection, avatar?: string) => void;
}

/**
 * 个人信息编辑器组件
 */
export default function PersonalInfoEditor({
  personalInfoSection,
  avatar,
  onUpdate,
}: PersonalInfoEditorProps) {
  const [avatarUrl, setAvatarUrl] = useState(avatar || "");
  const [showLabels, setShowLabels] = useState(
    personalInfoSection?.showPersonalInfoLabels !== false
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 提取personalInfo到局部变量以简化代码，如果personalInfoSection不存在则使用空数组
  const personalInfo = personalInfoSection?.personalInfo || [];

  /**
   * 切换标签显示
   */
  const toggleShowLabels = () => {
    if (!personalInfoSection) return;
    const newShowLabels = !showLabels;
    setShowLabels(newShowLabels);
    onUpdate({
      ...personalInfoSection,
      showPersonalInfoLabels: newShowLabels
    });
  };

  useEffect(() => {
    if (!avatar) return;
    setAvatarUrl(avatar);
  }, [avatar]);

  /**
   * 处理文件上传
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!personalInfoSection) return;
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAvatarUrl(base64);
        onUpdate({
          ...personalInfoSection,
          personalInfo: personalInfo
        }, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 更新个人信息项
   */
  const updatePersonalInfoItem = (
    id: string,
    updates: Partial<PersonalInfoItem>
  ) => {
    if (!personalInfoSection) return;
    const updatedInfo = personalInfo.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate({
      ...personalInfoSection,
      personalInfo: updatedInfo
    }, avatarUrl);
  };

  /**
   * 添加新的个人信息项
   */
  const addPersonalInfoItem = () => {
    if (!personalInfoSection) return;
    const newItem = createNewPersonalInfoItem();
    onUpdate({
      ...personalInfoSection,
      personalInfo: [...personalInfo, newItem]
    }, avatarUrl);
  };

  /**
   * 删除个人信息项
   */
  const removePersonalInfoItem = (id: string) => {
    if (!personalInfoSection) return;
    const updatedInfo = personalInfo.filter((item) => item.id !== id);
    onUpdate({
      ...personalInfoSection,
      personalInfo: updatedInfo
    }, avatarUrl);
  };

  /**
   * 处理头像URL变化
   */
  const handleAvatarChange = (url: string) => {
    if (!personalInfoSection) return;
    setAvatarUrl(url);
    onUpdate(personalInfoSection, url);
  };

  return (
    <Card className="section-card">
      <div className="section-header">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:account-circle" className="w-5 h-5 text-primary" />
          <h2 className="section-title">个人信息</h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleShowLabels}
            className="gap-2 bg-transparent"
          >
            <Icon icon={showLabels ? "mdi:eye-off" : "mdi:eye"} className="w-4 h-4" />
            {showLabels ? "隐藏标签" : "显示标签"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={addPersonalInfoItem}
            className="gap-2 bg-transparent"
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            添加信息
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* 头像设置 */}
        <div className="form-group">
          <Label className="form-label">头像</Label>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:cursor-pointer hover:border-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="头像预览"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon
                  icon="mdi:account"
                  className="w-8 h-8 text-muted-foreground"
                />
              )}
            </div>
            <div className="flex-1">
              <Input
                value={avatarUrl}
                onChange={(e) => handleAvatarChange(e.target.value)}
                placeholder="请输入头像图片URL或点击头像上传"
                className="mb-2 placeholder:text-gray-400 border border-border"
              />
              <p className="text-xs text-gray-400 pl-3">
                建议使用1:1比例的图片
              </p>
            </div>
          </div>
        </div>

        {/* 个人信息项列表 */}
        <div className="space-y-3">
          {personalInfo.map((item) => (
            <PersonalInfoItemEditor
              key={item.id}
              item={item}
              onUpdate={(updates) => updatePersonalInfoItem(item.id, updates)}
              onRemove={() => removePersonalInfoItem(item.id)}
            />
          ))}
        </div>

        {personalInfo.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon
              icon="mdi:information-outline"
              className="w-8 h-8 mx-auto mb-2 opacity-50"
            />
            <p className="text-sm">暂无个人信息，点击"添加信息"开始编辑</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </Card>
  );
}

/**
 * 个人信息项编辑器
 */
interface PersonalInfoItemEditorProps {
  item: PersonalInfoItem;
  onUpdate: (updates: Partial<PersonalInfoItem>) => void;
  onRemove: () => void;
}

function PersonalInfoItemEditor({
  item,
  onUpdate,
  onRemove,
}: PersonalInfoItemEditorProps) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30">
      {/* 图标选择 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="icon-button-personal-info bg-transparent w-8 h-8 p-0 flex items-center justify-center"
          >
            {item.icon && (
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择图标</DialogTitle>
          </DialogHeader>
          <IconPicker
            selectedIcon={item.icon}
            onSelect={(icon) => onUpdate({ icon })}
          />
        </DialogContent>
      </Dialog>

      {/* 单行布局：标签 | 类型 | 值输入 | 删除 */}
      <div className="flex-1 flex items-end gap-4">
        {/* 标签 */}
        <div className="w-36 flex-shrink-0">
          <div className="h-8 flex flex-col justify-end">
            <Input
              value={item.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="标签"
              className="h-8 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 类型选择 */}
        <div className="w-20 flex-shrink-0">
          <div className="h-8 flex flex-col justify-end">
            <Select
              value={item.value.type || "text"}
              onValueChange={(value: "text" | "link") => onUpdate({ value: { ...item.value, type: value } })}
            >
              <SelectTrigger className="h-8 py-0 px-3 text-sm border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">文本</SelectItem>
                <SelectItem value="link">链接</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 值输入 */}
        <div className="flex-1">
          {item.value.type === "link" ? (
            <div className="flex gap-6 h-8">
              <div className="flex-2 h-8 flex flex-col justify-end">
                <Input
                  value={item.value.content}
                  onChange={(e) => onUpdate({ value: { ...item.value, content: e.target.value } })}
                  placeholder="链接地址"
                  className="h-8 w-full placeholder:text-gray-400"
                />
              </div>
              <div className="flex-1 h-8 flex flex-col justify-end">
                <Input
                  value={item.value.title || ""}
                  onChange={(e) => onUpdate({ value: { ...item.value, title: e.target.value } })}
                  placeholder="显示标题"
                  className="h-8 w-full placeholder:text-gray-400"
                />
              </div>
            </div>
          ) : (
            <div className="h-8 flex flex-col justify-end">
              <Input
                value={item.value.content}
                onChange={(e) => onUpdate({ value: { ...item.value, content: e.target.value } })}
                placeholder="内容"
                className="h-8 w-full placeholder:text-gray-400"
              />
            </div>
          )}
        </div>

        {/* 删除按钮 */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="icon-button text-destructive hover:text-destructive h-8 w-8 p-0"
          >
            <Icon icon="mdi:delete" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

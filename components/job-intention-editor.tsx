"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { JobIntentionItem, JobIntentionSection } from "@/types/resume";
import { createNewJobIntentionItem } from "@/lib/resume-utils";

interface JobIntentionEditorProps {
  jobIntentionSection?: JobIntentionSection;
  onUpdate: (jobIntentionSection: JobIntentionSection) => void;
}

/**
 * 求职意向编辑器组件
 */
export default function JobIntentionEditor({
  jobIntentionSection,
  onUpdate,
}: JobIntentionEditorProps) {
  const [enabled, setEnabled] = useState(jobIntentionSection?.enabled ?? true);
  const items = jobIntentionSection?.items || [];

  // 同步外部 enabled 变化到本地状态，确保预览与编辑一致
  useEffect(() => {
    setEnabled(jobIntentionSection?.enabled ?? true);
  }, [jobIntentionSection?.enabled]);

  /**
   * 处理拖拽排序结束事件
   */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    if (source.index === destination.index) return;

    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    const [movedItem] = sortedItems.splice(source.index, 1);
    sortedItems.splice(destination.index, 0, movedItem);

    // 更新order字段
    const updatedItems = sortedItems.map((item, index) => ({
      ...item,
      order: index
    }));

    onUpdate({
      items: updatedItems,
      enabled
    });
  };

  /**
   * 切换启用状态
   */
  const toggleEnabled = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onUpdate({
      items,
      enabled: newEnabled
    });
  };

  /**
   * 更新求职意向项
   */
  const updateItem = (id: string, updates: Partial<JobIntentionItem>) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate({
      items: updatedItems,
      enabled
    });
  };

  /**
   * 添加新的求职意向项
   */
  const addItem = (type: 'workYears' | 'position' | 'city' | 'salary' | 'custom') => {
    if (items.length >= 6) {
      return;
    }
    const newItem = createNewJobIntentionItem(type, items.length);
    onUpdate({
      items: [...items, newItem],
      enabled
    });
  };

  /**
   * 检查某个类型是否已存在
   */
  const hasType = (type: string) => {
    return items.some(item => item.type === type);
  };

  /**
   * 获取可添加的类型列表
   */
  const getAvailableTypes = () => {
    return [
      { type: 'workYears' as const, label: '工作经验', icon: 'mdi:briefcase-clock', disabled: hasType('workYears') },
      { type: 'position' as const, label: '求职意向', icon: 'mdi:target', disabled: hasType('position') },
      { type: 'city' as const, label: '目标城市', icon: 'mdi:map-marker', disabled: hasType('city') },
      { type: 'salary' as const, label: '期望薪资', icon: 'mdi:currency-cny', disabled: hasType('salary') },
      { type: 'custom' as const, label: '自定义', icon: 'mdi:pencil', disabled: false },
    ];
  };

  /**
   * 删除求职意向项
   */
  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    onUpdate({
      items: updatedItems,
      enabled
    });
  };

  return (
    <Card className="section-card">
      <div className="section-header">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:briefcase-search" className="w-5 h-5 text-primary" />
          <h2 className="section-title">求职意向</h2>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="job-intention-enabled" className="text-sm cursor-pointer">
              启用
            </Label>
            <Switch
              id="job-intention-enabled"
              checked={enabled}
              onCheckedChange={toggleEnabled}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={items.length >= 6}
                className="gap-2 bg-transparent"
              >
                <Icon icon="mdi:plus" className="w-4 h-4" />
                添加 ({items.length}/6)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {getAvailableTypes().map((typeOption) => (
                <DropdownMenuItem
                  key={typeOption.type}
                  onClick={() => !typeOption.disabled && addItem(typeOption.type)}
                  disabled={typeOption.disabled}
                  className="gap-2 cursor-pointer"
                >
                  <Icon icon={typeOption.icon} className="w-4 h-4" />
                  <span>{typeOption.label}</span>
                  {typeOption.disabled && (
                    <span className="ml-auto text-xs text-muted-foreground">已添加</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-4">
        {/* 求职意向项列表 */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="job-intention-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {items
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'opacity-50' : ''}
                        >
                          <JobIntentionItemEditor
                            item={item}
                            onUpdate={(updates) => updateItem(item.id, updates)}
                            onRemove={() => removeItem(item.id)}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            disabled={!enabled}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon
              icon="mdi:information-outline"
              className="w-8 h-8 mx-auto mb-2 opacity-50"
            />
            <p className="text-sm">暂无求职意向信息，点击"添加"开始编辑</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * 求职意向项编辑器
 */
interface JobIntentionItemEditorProps {
  item: JobIntentionItem;
  onUpdate: (updates: Partial<JobIntentionItem>) => void;
  onRemove: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  disabled?: boolean;
}

function JobIntentionItemEditor({
  item,
  onUpdate,
  onRemove,
  dragHandleProps,
  isDragging,
  disabled,
}: JobIntentionItemEditorProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [salaryError, setSalaryError] = useState<string>("");

  const getIcon = () => {
    const icons = {
      workYears: "mdi:briefcase-clock",
      position: "mdi:target",
      city: "mdi:map-marker",
      salary: "mdi:currency-cny",
      custom: "mdi:pencil"
    };
    return icons[item.type];
  };

  const handleSalaryChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);

    if (numValue !== undefined && (isNaN(numValue) || numValue <= 0)) {
      setSalaryError("请输入正整数");
      // 不更新值，阻止保存错误数据
      return;
    }

    const newRange = {
      ...item.salaryRange,
      [field]: numValue
    };

    // 验证 min <= max
    if (newRange.min !== undefined && newRange.max !== undefined && newRange.min > newRange.max) {
      setSalaryError("最小值不能大于最大值");
      // 仍然更新值，但显示错误提示
      onUpdate({
        salaryRange: newRange,
        value: formatSalaryValue(newRange)
      });
      return;
    }

    setSalaryError("");
    onUpdate({
      salaryRange: newRange,
      value: formatSalaryValue(newRange)
    });
  };

  const formatSalaryValue = (range: { min?: number; max?: number }) => {
    if (range.min !== undefined && range.max !== undefined) {
      return `${range.min}K - ${range.max}K`;
    } else if (range.min !== undefined) {
      return `${range.min}K 起`;
    } else if (range.max !== undefined) {
      return `${range.max}K 以下`;
    }
    return '';
  };

  const handleWorkYearsChange = (value: string) => {
    const numValue = value === '' ? '' : parseInt(value);

    if (numValue !== '' && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      return;
    }

    onUpdate({
      value: numValue === '' ? '' : `${numValue}年`
    });
  };

  return (
    <div className={`p-2 border rounded-lg ${disabled ? 'bg-muted/50 opacity-60' : 'bg-muted/30'}`}>
      <div className="flex items-start gap-2">
        {/* 图标 */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          <Icon icon={getIcon()} className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* 标签 */}
        <div className="flex-[0_0_auto] min-w-[80px] max-w-[120px] pt-0">
          <Input
            value={item.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="标签"
            disabled={disabled || item.type !== 'custom'}
            className="h-8 placeholder:text-gray-400 text-sm"
          />
        </div>

        {/* 值输入 - 根据类型不同显示不同的输入框 */}
        <div className="flex-1 min-w-0">
          {item.type === 'workYears' ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={100}
                value={item.value.replace('年', '')}
                onChange={(e) => handleWorkYearsChange(e.target.value)}
                placeholder="如：3"
                disabled={disabled}
                className="h-8 w-full placeholder:text-gray-400 text-sm"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">年</span>
            </div>
          ) : item.type === 'salary' ? (
            <div>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={1}
                  value={item.salaryRange?.min ?? ''}
                  onChange={(e) => handleSalaryChange('min', e.target.value)}
                  placeholder="6"
                  disabled={disabled}
                  className={`h-8 w-full placeholder:text-gray-400 text-sm ${salaryError ? 'border-destructive' : ''}`}
                />
                <span className="text-sm text-muted-foreground">K</span>
                <span className="text-sm text-muted-foreground">-</span>
                <Input
                  type="number"
                  min={1}
                  value={item.salaryRange?.max ?? ''}
                  onChange={(e) => handleSalaryChange('max', e.target.value)}
                  placeholder="8"
                  disabled={disabled}
                  className={`h-8 w-full placeholder:text-gray-400 text-sm ${salaryError ? 'border-destructive' : ''}`}
                />
                <span className="text-sm text-muted-foreground">K</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon icon="mdi:information-outline" className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>K = 1000元</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {salaryError && (
                <p className="text-xs text-destructive mt-1">{salaryError}</p>
              )}
            </div>
          ) : (
            <Input
              value={item.value}
              onChange={(e) => onUpdate({ value: e.target.value })}
              placeholder={item.type === 'position' ? '如：Java开发工程师' : item.type === 'city' ? '如：北京' : '内容'}
              disabled={disabled}
              className="h-8 w-full placeholder:text-gray-400 text-sm"
            />
          )}
        </div>

        {/* 删除按钮和拖拽手柄组 */}
        <div className="flex items-center gap-1 flex-[0_0_auto] pt-0">
          {/* 删除按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={disabled}
            className="icon-button text-destructive hover:text-destructive h-8 w-8 p-0 flex-shrink-0"
          >
            <Icon icon="mdi:delete" className="w-4 h-4" />
          </Button>

          {/* 拖拽手柄 */}
          <div
            {...dragHandleProps}
            className={`flex items-center justify-center w-8 h-8 rounded cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground flex-shrink-0 ${isDragging ? 'text-foreground' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Icon icon="mdi:drag" className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个求职意向项吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onRemove();
                setShowDeleteConfirm(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FloatingActionBarProps {
  onAddRow: (columns: 1 | 2 | 3 | 4, afterRowId?: string) => void
  onAddTagsRow?: () => void
  onDelete: () => void
}

export default function FloatingActionBar({ onAddRow, onAddTagsRow, onDelete }: FloatingActionBarProps) {
  return (
    <TooltipProvider>
      <div className="absolute top-full right-0 flex items-center gap-0 rounded shadow-md overflow-hidden z-10">
        {/* 添加一行 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-5 px-1 rounded-none bg-teal-500 hover:bg-teal-600 text-white border-r border-black/20"
              onClick={() => onAddRow(1)}
            >
              <span className="flex items-center justify-center gap-0.5">
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
                </svg>
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96C448 60.65 419.3 32 384 32zM288 384H160c-13.25 0-24-10.75-24-24S146.8 336 160 336h40V196.8L185.3 206.6C174.3 213.9 159.4 210.1 152 199.1C144.7 188.9 147.7 174 158.7 166.7l52-34.66c7.391-4.938 16.86-5.375 24.64-1.188C243.1 135 248 143.2 248 152v184H288c13.25 0 24 10.75 24 24S301.3 384 288 384z"></path>
                </svg>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>添加一行</p>
          </TooltipContent>
        </Tooltip>

        {/* 添加一行二等分 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-5 px-1 rounded-none bg-teal-500 hover:bg-teal-600 text-white border-r border-black/20"
              onClick={() => onAddRow(2)}
            >
              <span className="flex items-center justify-center gap-0.5">
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
                </svg>
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96C448 60.65 419.3 32 384 32zM296 384h-144c-9.922 0-18.81-6.094-22.39-15.38c-3.578-9.25-1.078-19.75 6.266-26.41l108.4-98.31c7.047-6.938 11.31-17 11.31-27.66s-4.266-20.72-12-28.31C227.4 172 200.9 172 184.6 187.9L173.6 198.7C164.1 208.1 148.1 207.9 139.7 198.4C130.4 188.9 130.5 173.7 140 164.5l11-10.78c34.8-34.19 91.45-34.19 126.3 0c17 16.69 26.38 38.91 26.38 62.56s-9.375 45.88-26.38 62.56L214.2 336H296c13.25 0 24 10.75 24 24S309.3 384 296 384z"></path>
                </svg>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>添加一行二等分</p>
          </TooltipContent>
        </Tooltip>

        {/* 添加一行三等分 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-5 px-1 rounded-none bg-teal-500 hover:bg-teal-600 text-white border-r border-black/20"
              onClick={() => onAddRow(3)}
            >
              <span className="flex items-center justify-center gap-0.5">
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
                </svg>
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96C448 60.65 419.3 32 384 32zM236 384H191.4c-28.23 0-53.2-17.1-62.13-44.78c-4.188-12.59 2.609-26.19 15.19-30.38C157 304.8 170.6 311.5 174.8 324C177.2 331.2 183.8 336 191.4 336H236c19.84 0 36-16.16 36-36S255.8 264 236 264H184c-9.891 0-18.78-6.062-22.38-15.31C158 239.5 160.5 229 167.8 222.3L218.3 176H152C138.8 176 128 165.3 128 152S138.8 128 152 128h128c9.891 0 18.78 6.062 22.38 15.31c3.578 9.219 1.141 19.69-6.156 26.38L245.2 216.5C287.2 221.1 320 256.8 320 300C320 346.3 282.3 384 236 384z"></path>
                </svg>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>添加一行三等分</p>
          </TooltipContent>
        </Tooltip>

        {/* 添加一行四等分 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-5 px-1 rounded-none bg-teal-500 hover:bg-teal-600 text-white border-r border-black/20"
              onClick={() => onAddRow(4)}
            >
              <span className="flex items-center justify-center gap-0.5">
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
                </svg>
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96C448 60.65 419.3 32 384 32zM296 320H288v40c0 13.25-10.75 24-24 24s-24-10.75-24-24V320H138c-8.078 0-15.61-4.062-20.05-10.81s-5.188-15.25-2-22.69l62-144c5.234-12.16 19.31-17.84 31.53-12.53c12.19 5.219 17.8 19.34 12.56 31.53L174.5 272H240V221.3c0-13.25 10.75-24 24-24s24 10.75 24 24V272h8C309.3 272 320 282.8 320 296S309.3 320 296 320z"></path>
                </svg>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>添加一行四等分</p>
          </TooltipContent>
        </Tooltip>

        {/* 添加标签行 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-5 px-1 rounded-none bg-teal-500 hover:bg-teal-600 text-white border-r border-black/20"
              onClick={() => onAddTagsRow && onAddTagsRow()}
            >
              <span className="flex items-center justify-center gap-0.5">
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
                </svg>
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <path fill="currentColor" d="M433.2 103.1L581.4 253.4C609.1 281.5 609.1 326.5 581.4 354.6L425 512.9C415.7 522.3 400.5 522.4 391.1 513.1C381.7 503.8 381.6 488.6 390.9 479.2L547.3 320.8C556.5 311.5 556.5 296.4 547.3 287.1L399 136.9C389.7 127.5 389.8 112.3 399.2 103C408.6 93.7 423.8 93.8 433.1 103.2zM64.1 293.5L64.1 160C64.1 124.7 92.8 96 128.1 96L261.6 96C278.6 96 294.9 102.7 306.9 114.7L450.9 258.7C475.9 283.7 475.9 324.2 450.9 349.2L317.4 482.7C292.4 507.7 251.9 507.7 226.9 482.7L82.9 338.7C70.9 326.7 64.2 310.4 64.2 293.4zM208.1 208C208.1 190.3 193.8 176 176.1 176C158.4 176 144.1 190.3 144.1 208C144.1 225.7 158.4 240 176.1 240C193.8 240 208.1 225.7 208.1 208z" />
                </svg>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>添加标签行</p>
          </TooltipContent>
        </Tooltip>

        {/* 删除 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-5 px-1.5 rounded-none bg-red-500 hover:bg-red-600 text-white"
              onClick={onDelete}
            >
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>删除</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

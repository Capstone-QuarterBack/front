"use client";

import { useSettings } from "@/contexts/settings-context";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function UISettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme-select">테마 모드</Label>
        <Select
          value={settings.theme}
          onValueChange={(value) =>
            updateSettings({ theme: value as "light" | "dark" | "system" })
          }
        >
          <SelectTrigger id="theme-select">
            <SelectValue placeholder="테마 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">라이트 모드</SelectItem>
            <SelectItem value="dark">다크 모드</SelectItem>
            <SelectItem value="system">시스템 설정 사용</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="font-size">글자 크기</Label>
          <span className="text-sm text-muted-foreground">
            {settings.fontSize}px
          </span>
        </div>
        <Slider
          id="font-size"
          min={12}
          max={24}
          step={1}
          value={[settings.fontSize]}
          onValueChange={(value) => updateSettings({ fontSize: value[0] })}
        />
      </div>

      <div className="space-y-2">
        <Label>색상 테마</Label>
        <RadioGroup
          value={settings.colorTheme}
          onValueChange={(value) =>
            updateSettings({
              colorTheme: value as "default" | "sejong" | "blue" | "green",
            })
          }
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="theme-default" />
            <Label htmlFor="theme-default" className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary"></div>
              기본
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sejong" id="theme-sejong" />
            <Label htmlFor="theme-sejong" className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-red-600"></div>
              세종대학교
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blue" id="theme-blue" />
            <Label htmlFor="theme-blue" className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-600"></div>
              블루
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="green" id="theme-green" />
            <Label htmlFor="theme-green" className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-600"></div>
              그린
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

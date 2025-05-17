"use client";

import { useSettings } from "@/contexts/settings-context";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DataSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>기본 차트 유형</Label>
        <RadioGroup
          value={settings.chartType}
          onValueChange={(value) =>
            updateSettings({ chartType: value as "bar" | "line" | "pie" })
          }
          className="grid grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bar" id="chart-bar" />
            <Label htmlFor="chart-bar">막대 차트</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="line" id="chart-line" />
            <Label htmlFor="chart-line">선 차트</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pie" id="chart-pie" />
            <Label htmlFor="chart-pie">파이 차트</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="refresh-interval">데이터 새로고침 주기</Label>
          <span className="text-sm text-muted-foreground">
            {settings.refreshInterval}초
          </span>
        </div>
        <Slider
          id="refresh-interval"
          min={10}
          max={120}
          step={5}
          value={[settings.refreshInterval]}
          onValueChange={(value) =>
            updateSettings({ refreshInterval: value[0] })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-format">날짜 형식</Label>
        <Select
          value={settings.dateFormat}
          onValueChange={(value) =>
            updateSettings({
              dateFormat: value as "yyyy-MM-dd" | "MM/dd/yyyy" | "dd/MM/yyyy",
            })
          }
        >
          <SelectTrigger id="date-format">
            <SelectValue placeholder="날짜 형식 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (2023-05-15)</SelectItem>
            <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (05/15/2023)</SelectItem>
            <SelectItem value="dd/MM/yyyy">DD/MM/YYYY (15/05/2023)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

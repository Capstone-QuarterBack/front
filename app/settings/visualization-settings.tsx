"use client";

import { useSettings } from "@/contexts/settings-context";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VisualizationSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="render-quality">렌더링 품질</Label>
        <Select
          value={settings.renderQuality}
          onValueChange={(value) =>
            updateSettings({
              renderQuality: value as "low" | "medium" | "high",
            })
          }
        >
          <SelectTrigger id="render-quality">
            <SelectValue placeholder="품질 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">저품질 (성능 우선)</SelectItem>
            <SelectItem value="medium">중간 품질</SelectItem>
            <SelectItem value="high">고품질 (시각 효과 우선)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-labels">충전소 라벨 표시</Label>
        <Switch
          id="show-labels"
          checked={settings.showLabels}
          onCheckedChange={(checked) => updateSettings({ showLabels: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="enable-animations">애니메이션 효과</Label>
        <Switch
          id="enable-animations"
          checked={settings.enableAnimations}
          onCheckedChange={(checked) =>
            updateSettings({ enableAnimations: checked })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="camera-speed">카메라 이동 속도</Label>
          <span className="text-sm text-muted-foreground">
            {settings.cameraSpeed}x
          </span>
        </div>
        <Slider
          id="camera-speed"
          min={0.5}
          max={2}
          step={0.1}
          value={[settings.cameraSpeed]}
          onValueChange={(value) => updateSettings({ cameraSpeed: value[0] })}
        />
      </div>
    </div>
  );
}

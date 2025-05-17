"use client";

import { useSettings } from "@/contexts/settings-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AccessibilitySettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="high-contrast" className="block">
            고대비 모드
          </Label>
          <p className="text-sm text-muted-foreground">
            텍스트와 배경 간의 대비를 높여 가독성을 향상시킵니다.
          </p>
        </div>
        <Switch
          id="high-contrast"
          checked={settings.highContrast}
          onCheckedChange={(checked) =>
            updateSettings({ highContrast: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="reduce-motion" className="block">
            애니메이션 감소
          </Label>
          <p className="text-sm text-muted-foreground">
            화면 전환 및 UI 애니메이션 효과를 줄입니다.
          </p>
        </div>
        <Switch
          id="reduce-motion"
          checked={settings.reduceMotion}
          onCheckedChange={(checked) =>
            updateSettings({ reduceMotion: checked })
          }
        />
      </div>
    </div>
  );
}

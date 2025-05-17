"use client";

import { useState } from "react";
import { useSettings } from "@/contexts/settings-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, Zap } from "lucide-react";
import Link from "next/link";

import UISettings from "./ui-settings";
import StationSettings from "./station-settings";

export default function SettingsPage() {
  const { resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState("ui");

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">설정</h1>
        </div>
        <Button variant="outline" onClick={resetSettings}>
          기본 설정으로 초기화
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>세종대학교 충전소 관리 시스템 설정</CardTitle>
          <CardDescription>
            시스템 설정을 사용자 환경에 맞게 조정하세요. 모든 설정은 자동으로
            저장됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="ui" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">UI/UX</span>
              </TabsTrigger>
              <TabsTrigger value="stations" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">충전소 관리</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ui" className="mt-0">
              <UISettings />
            </TabsContent>

            <TabsContent value="stations" className="mt-0">
              <StationSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            설정은 자동으로 저장되며 브라우저에 로컬로 저장됩니다.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

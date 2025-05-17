"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import OcppLogHistory from "@/components/ocpp/OcppLogHistory";
import OcppLiveMonitor from "@/components/ocpp/OcppLiveMonitor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OcppLogsPage() {
  const [activeTab, setActiveTab] = useState<string>("history");

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar activeItem="ocpp-logs" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 md:p-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold mb-4">OCPP 로그 관리</h1>
          </div>

          <Tabs
            defaultValue="history"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-zinc-800 border-b border-zinc-700 w-full justify-start h-auto p-0">
              <TabsTrigger
                value="history"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
              >
                로그 내역
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
              >
                실시간 모니터링
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4">
              <OcppLogHistory />
            </TabsContent>

            <TabsContent value="live" className="mt-4">
              <OcppLiveMonitor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

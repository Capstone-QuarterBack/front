"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { TransactionSummary } from "@/components/transactions/TransactionSummary"
import { TransactionTable } from "@/components/transactions/TransactionTable"
import { TransactionSearch } from "@/components/transactions/TransactionSearch"
import { TransactionDateFilter } from "@/components/transactions/TransactionDateFilter"
import { Card } from "@/components/ui/Card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransactionHistory() {
  const [activeTab, setActiveTab] = useState<string>("충전 내역")

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar activeItem="transactions" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 md:p-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold mb-4">충전소 거래내역</h1>

            {/* 날짜 필터 */}
            <TransactionDateFilter />

            {/* 요약 정보 */}
            <TransactionSummary />
          </div>

          {/* 탭 메뉴 */}
          <div className="mb-4">
            <Tabs defaultValue="충전 내역" className="w-full">
              <TabsList className="bg-zinc-800 border-b border-zinc-700 w-full justify-start h-auto p-0">
                <TabsTrigger
                  value="ESS 상태"
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                  onClick={() => setActiveTab("ESS 상태")}
                >
                  ESS 상태
                </TabsTrigger>
                <TabsTrigger
                  value="충전 내역"
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                  onClick={() => setActiveTab("충전 내역")}
                >
                  충전 내역
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 충전소 검색 및 거래 내역 테이블 */}
          <Card className="overflow-hidden">
            <div className="p-4">
              <TransactionSearch />
            </div>
            <TransactionTable />
          </Card>
        </div>
      </div>
    </div>
  )
}

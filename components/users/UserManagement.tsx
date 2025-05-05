"use client"

import { useState } from "react"
import { Search, FileSpreadsheet } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DataTable } from "@/components/ui/DataTable"
import { Card } from "@/components/ui/Card"

interface User {
  userId: string
  username: string
  userCode: string
  carInfo: string
  registDate: string
}

export default function UserManagement() {
  const [searchType, setSearchType] = useState<string>("userId")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [users, setUsers] = useState<User[]>([
    {
      userId: "a1b1c1d3",
      username: "MaYeongChang",
      userCode: "USER-1042",
      carInfo: "Tesla-102",
      registDate: "2025-01-02 11:25:20",
    },
    {
      userId: "a1b1c1d3",
      username: "MaYeongChang",
      userCode: "USER-1042",
      carInfo: "Tesla-102",
      registDate: "2025-01-02 11:25:20",
    },
    {
      userId: "a1b1c1d3",
      username: "MaYeongChang",
      userCode: "USER-1042",
      carInfo: "Tesla-102",
      registDate: "2025-01-02 11:25:20",
    },
    {
      userId: "a1b1c1d3",
      username: "MaYeongChang",
      userCode: "USER-1042",
      carInfo: "Tesla-102",
      registDate: "2025-01-02 11:25:20",
    },
  ])

  const columns = [
    {
      header: "사용자 아이디",
      accessor: "userId",
    },
    {
      header: "사용자명",
      accessor: "username",
    },
    {
      header: "고유번호",
      accessor: "userCode",
    },
    {
      header: "차량정보",
      accessor: "carInfo",
    },
    {
      header: "등록일",
      accessor: "registDate",
    },
    {
      header: "",
      accessor: "actions",
      cellRenderer: () => (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" className="h-7 text-xs">
            수정
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs">
            조회
          </Button>
        </div>
      ),
    },
  ]

  const handleSearch = () => {
    // 실제 구현에서는 API 호출을 통해 검색 결과를 가져옵니다.
    console.log(`검색 유형: ${searchType}, 검색어: ${searchTerm}`)
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar activeItem="users" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 md:p-4">
          <h1 className="text-xl font-bold mb-4">사용자 관리</h1>

          <Card className="mb-4">
            <div className="p-4 flex flex-col sm:flex-row items-end gap-2">
              <div className="flex-1 flex items-center gap-2">
                <Select value={searchType} onValueChange={setSearchType} className="w-40 bg-zinc-700 border-zinc-600">
                  <option value="userId">사용자 아이디</option>
                  <option value="username">사용자명</option>
                  <option value="userCode">고유번호</option>
                  <option value="carInfo">차량정보</option>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    className="pl-8 h-9 bg-zinc-700 border-zinc-600 w-full"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleSearch} className="h-9">
                조회
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-0">
              <DataTable
                columns={columns}
                data={users}
                headerClassName="bg-zinc-800 text-zinc-300"
                rowClassName="border-b border-zinc-700 hover:bg-zinc-800"
                cellClassName="py-3 px-4"
              />
            </div>
            <div className="p-4 flex justify-end">
              <Button variant="outline" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span>엑셀 다운로드</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

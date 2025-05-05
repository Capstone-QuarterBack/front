"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, FileSpreadsheet } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/DataTable"
import { Card } from "@/components/ui/Card"
import { UserRegistrationModal } from "@/components/users/UserRegistrationModal"
import { UserDetailModal } from "@/components/users/UserDetailModal"
import { Pagination } from "@/components/ui/pagination"

interface User {
  userId: string
  username: string
  userCode: string
  carInfo: string
  registDate: string
  email?: string
  phone?: string
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
      email: "mayeong@example.com",
      phone: "010-1234-5678",
    },
    {
      userId: "e5f6g7h8",
      username: "KimMinJi",
      userCode: "USER-1043",
      carInfo: "Hyundai-EV",
      registDate: "2025-01-03 09:15:10",
      email: "minji@example.com",
      phone: "010-2345-6789",
    },
    {
      userId: "i9j0k1l2",
      username: "ParkJiSung",
      userCode: "USER-1044",
      carInfo: "Kia-EV6",
      registDate: "2025-01-04 14:30:45",
      email: "jisung@example.com",
      phone: "010-3456-7890",
    },
    {
      userId: "m3n4o5p6",
      username: "LeeJiHye",
      userCode: "USER-1045",
      carInfo: "BMW-i4",
      registDate: "2025-01-05 16:20:30",
      email: "jihye@example.com",
      phone: "010-4567-8901",
    },
    {
      userId: "q7r8s9t0",
      username: "ChoiSungMin",
      userCode: "USER-1046",
      carInfo: "Mercedes-EQS",
      registDate: "2025-01-06 10:45:15",
      email: "sungmin@example.com",
      phone: "010-5678-9012",
    },
    {
      userId: "u1v2w3x4",
      username: "JungHaeJin",
      userCode: "USER-1047",
      carInfo: "Audi-e-tron",
      registDate: "2025-01-07 13:10:25",
      email: "haejin@example.com",
      phone: "010-6789-0123",
    },
    {
      userId: "y5z6a7b8",
      username: "KangDongWon",
      userCode: "USER-1048",
      carInfo: "Porsche-Taycan",
      registDate: "2025-01-08 09:30:40",
      email: "dongwon@example.com",
      phone: "010-7890-1234",
    },
    {
      userId: "c9d0e1f2",
      username: "ShinMinAh",
      userCode: "USER-1049",
      carInfo: "Volvo-C40",
      registDate: "2025-01-09 15:55:20",
      email: "minah@example.com",
      phone: "010-8901-2345",
    },
  ])

  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 검색어에 따라 사용자 필터링
  useEffect(() => {
    let filtered = [...users]

    if (searchTerm.trim() !== "") {
      filtered = users.filter((user) => {
        const value = user[searchType as keyof User]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    setFilteredUsers(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1) // 검색 결과가 변경되면 첫 페이지로 이동
  }, [users, searchTerm, searchType, itemsPerPage])

  // 현재 페이지에 표시할 사용자 목록
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }

  const handleSearch = () => {
    // 검색 버튼 클릭 시 필터링 실행 (이미 useEffect에서 처리됨)
    console.log(`검색 유형: ${searchType}, 검색어: ${searchTerm}`)
  }

  const handleUserRegistered = (newUser: User) => {
    setUsers((prevUsers) => [newUser, ...prevUsers])
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

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
      cellRenderer: (value: any, row: Record<string, any>) => (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" className="h-7 text-xs">
            수정
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleViewUser(row as User)}>
            조회
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar activeItem="users" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 md:p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">사용자 관리</h1>
            <UserRegistrationModal onUserRegistered={handleUserRegistered} />
          </div>

          <Card className="mb-4" title="검색">
            <div className="p-4 flex flex-col sm:flex-row items-end gap-2">
              <div className="flex-1 flex items-center gap-2">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-40 h-9 rounded-md bg-zinc-700 border-zinc-600 text-white"
                >
                  <option value="userId">사용자 아이디</option>
                  <option value="username">사용자명</option>
                  <option value="userCode">고유번호</option>
                  <option value="carInfo">차량정보</option>
                </select>
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

          <Card className="overflow-hidden" title="사용자 목록">
            <div className="p-0">
              <DataTable
                columns={columns}
                data={getCurrentPageUsers()}
                headerClassName="bg-zinc-800 text-zinc-300"
                rowClassName="border-b border-zinc-700 hover:bg-zinc-800"
                cellClassName="py-3 px-4"
                emptyMessage="검색 결과가 없습니다."
              />
            </div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">페이지당 항목 수:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="h-8 rounded-md bg-zinc-700 border-zinc-600 text-white text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-zinc-400">
                  총 {filteredUsers.length}개 항목 중 {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}개 표시
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                <Button variant="outline" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>엑셀 다운로드</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 사용자 상세 정보 모달 */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  )
}

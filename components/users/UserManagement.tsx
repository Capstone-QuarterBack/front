"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/DataTable"
import { Card } from "@/components/ui/card"
import { UserRegistrationModal } from "@/components/users/UserRegistrationModal"
import { UserDetailModal } from "@/components/users/UserDetailModal"
import { UserChargeHistoryModal } from "@/components/users/UserChargeHistoryModal"
import { UserEditModal } from "@/components/users/UserEditModal"
import { Pagination } from "@/components/ui/pagination"
import { fetchCustomers, searchCustomers, type Customer } from "@/services/userApi"
import { formatDate } from "@/lib/utils/date-utils"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"

export default function UserManagement() {
  const [searchType, setSearchType] = useState<string>("customerId")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [selectedUser, setSelectedUser] = useState<Customer | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isChargeHistoryModalOpen, setIsChargeHistoryModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch customers from API
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetchCustomers(currentPage, itemsPerPage)

        if (response && response.customerList) {
          setCustomers(response.customerList)
          setFilteredCustomers(response.customerList)
          setTotalPages(response.totalPages)
          setTotalElements(response.totalElements)
        } else {
          throw new Error("Failed to fetch customer data")
        }
      } catch (err) {
        console.error("Error loading customers:", err)
        setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [currentPage, itemsPerPage])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search term is empty, fetch all customers
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetchCustomers(currentPage, itemsPerPage)

        if (response && response.customerList) {
          setCustomers(response.customerList)
          setFilteredCustomers(response.customerList)
          setTotalPages(response.totalPages)
          setTotalElements(response.totalElements)
        } else {
          throw new Error("Failed to fetch customer data")
        }
      } catch (err) {
        console.error("Error loading customers:", err)
        setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
      } finally {
        setIsLoading(false)
      }
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await searchCustomers(searchType, searchTerm, currentPage, itemsPerPage)

      if (response && response.customerList) {
        setCustomers(response.customerList)
        setFilteredCustomers(response.customerList)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      } else {
        throw new Error("Failed to search customer data")
      }
    } catch (err) {
      console.error("Error searching customers:", err)
      setError(`검색 중 오류가 발생했습니다: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserRegistered = (newUser: any) => {
    // Refresh the customer list after a new user is registered
    fetchCustomers(currentPage, itemsPerPage).then((response) => {
      if (response && response.customerList) {
        setCustomers(response.customerList)
        setFilteredCustomers(response.customerList)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      }
    })
  }

  const handleUserUpdated = () => {
    // Refresh the customer list after a user is updated
    fetchCustomers(currentPage, itemsPerPage).then((response) => {
      if (response && response.customerList) {
        setCustomers(response.customerList)
        setFilteredCustomers(response.customerList)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      }
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1) // API uses 0-based indexing
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(0) // Reset to first page when changing items per page
  }

  const handleViewUser = (user: Customer) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  const handleEditUser = (user: Customer) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleViewChargeHistory = (user: Customer) => {
    setSelectedUser(user)
    setIsChargeHistoryModalOpen(true)
  }

  // Convert Customer to the format expected by UserDetailModal
  const convertToUserDetailFormat = (customer: Customer) => {
    return {
      userId: customer.customerId,
      username: customer.customerName,
      userCode: customer.idToken,
      carInfo: customer.vehicleNo,
      registDate: formatDate(customer.registrationDate),
      email: "", // These fields are not in the API response
      phone: "", // These fields are not in the API response
    }
  }

  const columns = [
    {
      header: "사용자 아이디",
      accessor: "customerId",
    },
    {
      header: "사용자명",
      accessor: "customerName",
    },
    {
      header: "고유번호",
      accessor: "idToken",
    },
    {
      header: "차량정보",
      accessor: "vehicleNo",
    },
    {
      header: "등록일",
      accessor: "registrationDate",
      cellRenderer: (value: string) => formatDate(value),
    },
    {
      header: "",
      accessor: "actions",
      cellRenderer: (value: any, row: Record<string, any>) => (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleEditUser(row as Customer)}>
            수정
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => handleViewChargeHistory(row as Customer)}
          >
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
                  <option value="customerId">사용자 아이디</option>
                  <option value="customerName">사용자명</option>
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
            {isLoading ? (
              <div className={loadingStyles.container}>
                <div className={loadingStyles.spinner}></div>
              </div>
            ) : error ? (
              <div className={errorStyles.container}>{error}</div>
            ) : (
              <>
                <div className="p-0">
                  <DataTable
                    columns={columns}
                    data={filteredCustomers}
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
                      총 {totalElements}개 항목 중 {currentPage * itemsPerPage + 1}-
                      {Math.min((currentPage + 1) * itemsPerPage, totalElements)}개 표시
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Pagination
                      currentPage={currentPage + 1} // UI uses 1-based indexing
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* 사용자 상세 정보 모달 */}
      {selectedUser && (
        <UserDetailModal
          user={convertToUserDetailFormat(selectedUser)}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {/* 사용자 충전 내역 모달 */}
      {selectedUser && (
        <UserChargeHistoryModal
          customerId={selectedUser.customerId}
          customerName={selectedUser.customerName}
          isOpen={isChargeHistoryModalOpen}
          onClose={() => setIsChargeHistoryModalOpen(false)}
        />
      )}

      {/* 사용자 정보 수정 모달 */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  )
}

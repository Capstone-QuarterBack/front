"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal"

interface UserRegistrationModalProps {
  onUserRegistered?: (user: any) => void
}

export function UserRegistrationModal({ onUserRegistered }: UserRegistrationModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    userCode: "",
    carInfo: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출을 통해 사용자를 등록합니다.
      console.log("사용자 등록:", formData)

      // 모의 API 응답 (실제 구현에서는 API 응답을 사용)
      const newUser = {
        ...formData,
        registDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      }

      // 부모 컴포넌트에 새 사용자 정보 전달
      if (onUserRegistered) {
        onUserRegistered(newUser)
      }

      // 모달 닫기 및 폼 초기화
      setOpen(false)
      setFormData({
        userId: "",
        username: "",
        userCode: "",
        carInfo: "",
        email: "",
        phone: "",
      })
    } catch (error) {
      console.error("사용자 등록 오류:", error)
      // 오류 처리 (실제 구현에서는 사용자에게 오류 메시지 표시)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="h-9">사용자 등록</Button>
      </ModalTrigger>
      <ModalContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>사용자 등록</ModalTitle>
            <ModalDescription>새로운 사용자 정보를 입력하세요.</ModalDescription>
          </ModalHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="userId" className="text-right text-sm text-zinc-400">
                아이디
              </label>
              <Input
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="col-span-3 bg-zinc-700 border-zinc-600"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right text-sm text-zinc-400">
                사용자명
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="col-span-3 bg-zinc-700 border-zinc-600"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="userCode" className="text-right text-sm text-zinc-400">
                고유번호
              </label>
              <Input
                id="userCode"
                name="userCode"
                value={formData.userCode}
                onChange={handleChange}
                className="col-span-3 bg-zinc-700 border-zinc-600"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="carInfo" className="text-right text-sm text-zinc-400">
                차량정보
              </label>
              <Input
                id="carInfo"
                name="carInfo"
                value={formData.carInfo}
                onChange={handleChange}
                className="col-span-3 bg-zinc-700 border-zinc-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm text-zinc-400">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3 bg-zinc-700 border-zinc-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right text-sm text-zinc-400">
                전화번호
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3 bg-zinc-700 border-zinc-600"
              />
            </div>
          </div>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "등록"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

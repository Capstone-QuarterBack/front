"use client";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";

interface User {
  userId: string;
  username: string;
  userCode: string;
  carInfo: string;
  registDate: string;
  email?: string;
  phone?: string;
}

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-[500px]">
        <ModalHeader>
          <ModalTitle>사용자 상세 정보</ModalTitle>
        </ModalHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 border-b border-zinc-700 pb-2">
              <span className="text-sm text-zinc-400">사용자 아이디</span>
              <span className="col-span-2 font-medium">{user.userId}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-zinc-700 pb-2">
              <span className="text-sm text-zinc-400">사용자명</span>
              <span className="col-span-2 font-medium">{user.username}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-zinc-700 pb-2">
              <span className="text-sm text-zinc-400">고유번호</span>
              <span className="col-span-2 font-medium">{user.userCode}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-zinc-700 pb-2">
              <span className="text-sm text-zinc-400">차량정보</span>
              <span className="col-span-2 font-medium">{user.carInfo}</span>
            </div>
            {user.email && (
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-700 pb-2">
                <span className="text-sm text-zinc-400">이메일</span>
                <span className="col-span-2 font-medium">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-700 pb-2">
                <span className="text-sm text-zinc-400">전화번호</span>
                <span className="col-span-2 font-medium">{user.phone}</span>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 border-b border-zinc-700 pb-2">
              <span className="text-sm text-zinc-400">등록일</span>
              <span className="col-span-2 font-medium">{user.registDate}</span>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { updateCustomer, type Customer } from "@/services/userApi";

interface UserEditModalProps {
  user: Customer;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export function UserEditModal({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}: UserEditModalProps) {
  const [formData, setFormData] = useState({
    customerName: user.customerName || "",
    phoneNumber: "", // Will be populated with mock data initially
    email: "", // Will be populated with mock data initially
    vehicleNo: user.vehicleNo || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form with mock data for fields not in the API response
  useEffect(() => {
    if (isOpen) {
      // Reset form data when modal opens
      setFormData({
        customerName: user.customerName || "",
        phoneNumber: "010-1234-5678", // Mock data for phone number with formatting
        email: "user@example.com", // Mock data for email
        vehicleNo: user.vehicleNo || "",
      });
      setMessage(null);
      setErrors({});
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Replace the handlePhoneChange function with this simpler version:
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));

    // Clear error for this field when user types
    if (errors.phoneNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "사용자명을 입력하십시오.";
    }

    // In the validateForm function, replace the phone number validation with:
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "전화번호를 입력하십시오.";
    }
    // Remove the regex validation for phone number

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "유효한 이메일을 입력하십시오.";
    }

    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = "차량정보를 입력하십시오.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await updateCustomer(user.customerId, formData);

      if (response && response.customerId) {
        setMessage({ type: "success", text: "수정이 완료되었습니다." });
        setTimeout(() => {
          onClose();
          onUserUpdated();
        }, 1500);
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);

      // Check if the error message contains a JSON string
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('"phone"')) {
        setErrors({ phoneNumber: "전화번호를 입력하십시오." });
        setMessage({ type: "error", text: "전화번호를 입력하십시오." });
      } else {
        setMessage({
          type: "error",
          text: `수정 중 오류가 발생했습니다: ${(error as Error).message}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-[500px]">
        <ModalHeader>
          <ModalTitle>사용자 정보 수정</ModalTitle>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <label
                htmlFor="customerName"
                className="text-right text-sm text-zinc-400"
              >
                사용자명
              </label>
              <div className="col-span-2">
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={`bg-zinc-700 border-zinc-600 ${
                    errors.customerName ? "border-red-500" : ""
                  }`}
                  placeholder="사용자 이름을 입력하세요"
                  required
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <label
                htmlFor="phoneNumber"
                className="text-right text-sm text-zinc-400"
              >
                전화번호
              </label>
              <div className="col-span-2">
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  className={`bg-zinc-700 border-zinc-600 ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  placeholder="전화번호를 입력하세요"
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <label
                htmlFor="email"
                className="text-right text-sm text-zinc-400"
              >
                이메일
              </label>
              <div className="col-span-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-zinc-700 border-zinc-600 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <label
                htmlFor="vehicleNo"
                className="text-right text-sm text-zinc-400"
              >
                차량정보
              </label>
              <div className="col-span-2">
                <Input
                  id="vehicleNo"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleChange}
                  className={`bg-zinc-700 border-zinc-600 ${
                    errors.vehicleNo ? "border-red-500" : ""
                  }`}
                  placeholder="차량 번호 또는 모델명"
                  required
                />
                {errors.vehicleNo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vehicleNo}
                  </p>
                )}
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-center ${
                  message.type === "success"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-red-900/50 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : "수정"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

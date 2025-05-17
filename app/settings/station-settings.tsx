"use client";

import { useState } from "react";
import { useSettings, type ChargingStation } from "@/contexts/settings-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { generateId } from "@/lib/utils/id-utils";

export default function StationSettings() {
  const { settings, addStation, updateStation, deleteStation } = useSettings();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] =
    useState<ChargingStation | null>(null);

  // 새 충전소 상태
  const [newStation, setNewStation] = useState<Omit<ChargingStation, "id">>({
    name: "",
    location: "",
    chargers: 1,
    status: "active",
  });

  // 편집 중인 충전소 상태
  const [editingStation, setEditingStation] = useState<ChargingStation>({
    id: "",
    name: "",
    location: "",
    chargers: 1,
    status: "active",
  });

  // 충전소 추가 핸들러
  const handleAddStation = () => {
    const station: ChargingStation = {
      id: generateId(),
      ...newStation,
    };
    addStation(station);
    setNewStation({
      name: "",
      location: "",
      chargers: 1,
      status: "active",
    });
    setIsAddDialogOpen(false);
  };

  // 충전소 편집 핸들러
  const handleEditStation = () => {
    if (editingStation.id) {
      updateStation(editingStation.id, editingStation);
      setIsEditDialogOpen(false);
      setSelectedStation(null);
    }
  };

  // 충전소 삭제 핸들러
  const handleDeleteStation = (id: string) => {
    if (confirm("정말로 이 충전소를 삭제하시겠습니까?")) {
      deleteStation(id);
    }
  };

  // 충전소 편집 모달 열기
  const openEditDialog = (station: ChargingStation) => {
    setEditingStation(station);
    setSelectedStation(station);
    setIsEditDialogOpen(true);
  };

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: ChargingStation["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">활성</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500">유지보수</Badge>;
      case "disabled":
        return <Badge className="bg-red-500">비활성</Badge>;
      default:
        return <Badge>알 수 없음</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">충전소 관리</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              충전소 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 충전소 추가</DialogTitle>
              <DialogDescription>
                새로운 충전소 정보를 입력하세요. 모든 필드는 필수입니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">충전소 이름</Label>
                <Input
                  id="name"
                  value={newStation.name}
                  onChange={(e) =>
                    setNewStation({ ...newStation, name: e.target.value })
                  }
                  placeholder="세종대학교 충전소"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">위치</Label>
                <Input
                  id="location"
                  value={newStation.location}
                  onChange={(e) =>
                    setNewStation({ ...newStation, location: e.target.value })
                  }
                  placeholder="서울특별시 광진구 능동로 209"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chargers">충전기 수</Label>
                <Input
                  id="chargers"
                  type="number"
                  min="1"
                  value={newStation.chargers}
                  onChange={(e) =>
                    setNewStation({
                      ...newStation,
                      chargers: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={newStation.status}
                  onValueChange={(value) =>
                    setNewStation({
                      ...newStation,
                      status: value as "active" | "maintenance" | "disabled",
                    })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="maintenance">유지보수</SelectItem>
                    <SelectItem value="disabled">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleAddStation}
                disabled={!newStation.name || !newStation.location}
              >
                추가
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {settings.stations.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            등록된 충전소가 없습니다. 충전소를 추가해주세요.
          </p>
        ) : (
          settings.stations.map((station) => (
            <Card key={station.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(station)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStation(station.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">위치:</span>
                    <span className="text-sm">{station.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      충전기 수:
                    </span>
                    <span className="text-sm">{station.chargers}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">상태:</span>
                    <span>{getStatusBadge(station.status)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 충전소 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>충전소 정보 수정</DialogTitle>
            <DialogDescription>
              충전소 정보를 수정하세요. 모든 필드는 필수입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">충전소 이름</Label>
              <Input
                id="edit-name"
                value={editingStation.name}
                onChange={(e) =>
                  setEditingStation({ ...editingStation, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">위치</Label>
              <Input
                id="edit-location"
                value={editingStation.location}
                onChange={(e) =>
                  setEditingStation({
                    ...editingStation,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-chargers">충전기 수</Label>
              <Input
                id="edit-chargers"
                type="number"
                min="1"
                value={editingStation.chargers}
                onChange={(e) =>
                  setEditingStation({
                    ...editingStation,
                    chargers: Number.parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">상태</Label>
              <Select
                value={editingStation.status}
                onValueChange={(value) =>
                  setEditingStation({
                    ...editingStation,
                    status: value as "active" | "maintenance" | "disabled",
                  })
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="maintenance">유지보수</SelectItem>
                  <SelectItem value="disabled">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleEditStation}
              disabled={!editingStation.name || !editingStation.location}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

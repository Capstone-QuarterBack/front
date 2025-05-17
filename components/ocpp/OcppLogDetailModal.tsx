import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatTimestamp } from "@/lib/utils/date-utils"
import type { OcppMessage } from "@/services/ocppLogApi"
import { Badge } from "@/components/ui/badge"

interface OcppLogDetailModalProps {
  log: OcppMessage
  isOpen: boolean
  onClose: () => void
}

export function OcppLogDetailModal({ log, isOpen, onClose }: OcppLogDetailModalProps) {
  const getMessageTypeLabel = (type: number) => {
    switch (type) {
      case 2:
        return (
          <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-800">
            Request
          </Badge>
        )
      case 3:
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-800">
            Response
          </Badge>
        )
      case 4:
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-800">
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>OCPP 로그 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-zinc-400">타임스탬프</p>
            <p className="font-mono">{formatTimestamp(log.timestamp)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">충전소 ID</p>
            <p>{log.stationId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">메시지 타입</p>
            <p>{getMessageTypeLabel(log.messageType)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">액션</p>
            <p>{log.action}</p>
          </div>
        </div>

        <Tabs defaultValue="formatted">
          <TabsList className="mb-4">
            <TabsTrigger value="formatted">포맷된 메시지</TabsTrigger>
            <TabsTrigger value="raw">원본 메시지</TabsTrigger>
          </TabsList>
          <TabsContent value="formatted" className="mt-0">
            <div className="bg-zinc-900 rounded-md p-4 overflow-auto max-h-[400px]">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(log.rawMessage, null, 2)}</pre>
            </div>
          </TabsContent>
          <TabsContent value="raw" className="mt-0">
            <div className="bg-zinc-900 rounded-md p-4 overflow-auto max-h-[400px]">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(log.rawMessage, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

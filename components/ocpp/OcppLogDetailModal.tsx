import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date-utils";
import type { OcppMessage } from "@/services/ocppLogApi";
import type { OcppWebSocketMessage } from "@/services/ocppWebSocketService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OcppLogDetailModalProps {
  log: OcppMessage | OcppWebSocketMessage;
  isOpen: boolean;
  onClose: () => void;
}

export function OcppLogDetailModal({
  log,
  isOpen,
  onClose,
}: OcppLogDetailModalProps) {
  // 로그 타입 확인 (OcppMessage 또는 OcppWebSocketMessage)
  const isWebSocketMessage = "rawData" in log;

  // 메시지 데이터 추출
  const messageData = isWebSocketMessage
    ? log.rawData[3] // WebSocket 메시지의 경우 rawData[3]이 페이로드
    : log.payload;

  // 미터 값 추출 (있는 경우)
  const meterValues = messageData?.meterValue || [];

  // 방향 배지 렌더링
  const renderDirectionBadge = () => {
    if (log.direction === "incoming") {
      return (
        <Badge
          variant="outline"
          className="bg-green-900/20 text-green-400 border-green-500"
        >
          수신
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-blue-900/20 text-blue-400 border-blue-500"
      >
        송신
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>OCPP 메시지 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-800 rounded-md">
            <div>
              <p className="text-sm text-zinc-400">메시지 ID</p>
              <p className="font-mono">{log.id}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">타임스탬프</p>
              <p>{formatDate(log.timestamp, "yyyy-MM-dd HH:mm:ss.SSS")}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">메시지 타입</p>
              <p>{log.messageType}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">방향</p>
              <div>{renderDirectionBadge()}</div>
            </div>
            <div>
              <p className="text-sm text-zinc-400">액션</p>
              <p>{log.action}</p>
            </div>
            {log.stationId && (
              <div>
                <p className="text-sm text-zinc-400">충전소 ID</p>
                <p>{log.stationId}</p>
              </div>
            )}
            {log.chargerId && (
              <div>
                <p className="text-sm text-zinc-400">충전기 ID</p>
                <p>{log.chargerId}</p>
              </div>
            )}
            {"summary" in log && log.summary && (
              <div className="col-span-2">
                <p className="text-sm text-zinc-400">요약</p>
                <p>{log.summary}</p>
              </div>
            )}
          </div>

          {/* 탭 내용 */}
          <Tabs defaultValue="formatted">
            <TabsList>
              <TabsTrigger value="formatted">포맷된 데이터</TabsTrigger>
              <TabsTrigger value="raw">원시 데이터</TabsTrigger>
              {meterValues.length > 0 && (
                <TabsTrigger value="meter">미터 값</TabsTrigger>
              )}
            </TabsList>

            {/* 포맷된 데이터 탭 */}
            <TabsContent
              value="formatted"
              className="p-4 bg-zinc-800 rounded-md"
            >
              <div className="space-y-4">
                {Object.entries(messageData || {}).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-zinc-400">{key}</p>
                    <pre className="p-2 bg-zinc-900 rounded-md overflow-x-auto">
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </pre>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 원시 데이터 탭 */}
            <TabsContent value="raw" className="p-4 bg-zinc-800 rounded-md">
              <pre className="p-2 bg-zinc-900 rounded-md overflow-x-auto whitespace-pre-wrap">
                {isWebSocketMessage
                  ? JSON.stringify(log.rawData, null, 2)
                  : JSON.stringify(log.rawMessage || log.payload, null, 2)}
              </pre>
            </TabsContent>

            {/* 미터 값 탭 */}
            {meterValues.length > 0 && (
              <TabsContent value="meter" className="p-4 bg-zinc-800 rounded-md">
                {meterValues.map((meterValue: any, index: number) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm text-zinc-400 mb-2">
                      타임스탬프:{" "}
                      {formatDate(meterValue.timestamp, "yyyy-MM-dd HH:mm:ss")}
                    </p>

                    {meterValue.sampledValue &&
                      meterValue.sampledValue.length > 0 && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>값</TableHead>
                              <TableHead>측정 항목</TableHead>
                              <TableHead>컨텍스트</TableHead>
                              <TableHead>위치</TableHead>
                              <TableHead>상</TableHead>
                              <TableHead>단위</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {meterValue.sampledValue.map(
                              (sample: any, sampleIndex: number) => (
                                <TableRow key={sampleIndex}>
                                  <TableCell className="font-mono">
                                    {sample.value}
                                  </TableCell>
                                  <TableCell>
                                    {sample.measurand ||
                                      "Energy.Active.Import.Register"}
                                  </TableCell>
                                  <TableCell>
                                    {sample.context || "Sample.Periodic"}
                                  </TableCell>
                                  <TableCell>
                                    {sample.location || "Outlet"}
                                  </TableCell>
                                  <TableCell>{sample.phase || "L1"}</TableCell>
                                  <TableCell>{sample.unit || "Wh"}</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      )}
                  </div>
                ))}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

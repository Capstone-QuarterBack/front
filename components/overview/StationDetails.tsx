import type { StationDetailData } from "@/types/station"

interface StationDetailsProps {
  data: StationDetailData
}

export function StationDetails({ data }: StationDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <div className="text-xs text-zinc-400">충전 시작 시간</div>
        <div>{data.chargeTime}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">충전 전력량</div>
        <div>{data.totalPower}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">충전 완료 예상 시간</div>
        <div>{data.chargeEndTime}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">예상 가능 비용</div>
        <div>{data.maxPower}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">처리 상태 정보</div>
        <div className="text-green-500">승인완료</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">승인번호</div>
        <div>{data.cardNumber}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">차량 정보</div>
        <div>{data.transactionId}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">오류코드</div>
        <div>{data.carId}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">현재 충전 상태</div>
        <div>{data.occupancyRate}</div>
      </div>
      <div>
        <div className="text-xs text-zinc-400">전체 충전 요금액</div>
        <div>{data.totalRevenue}</div>
      </div>
    </div>
  )
}

import { Card } from "@/components/ui/Card"
import { DataTable } from "@/components/ui/DataTable"

export function ChargerUsage() {
  const columns = [
    { header: "시간대별", accessor: "time" },
    { header: "충전기 위치", accessor: "location" },
    { header: "충전기 모델", accessor: "model" },
    { header: "사용량", accessor: "usage" },
    { header: "거래", accessor: "transaction" },
    { header: "확인 상태", accessor: "status" },
  ]

  const data = Array(5)
    .fill(0)
    .map((_, i) => ({
      time: "2023/03/21 08:10:00",
      location: "충전기 위치",
      model: "충전기 모델",
      usage: "100(kWh)",
      transaction: "21,233(KRW)",
      status: "1999999-92",
    }))

  return (
    <Card title="충전기 사용 정보">
      <div className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] overflow-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </Card>
  )
}

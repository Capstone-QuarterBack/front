"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { StationOverviewData } from "@/services/api"

interface StationDetailModalProps {
  station: StationOverviewData | null
  onClose: () => void
  isOpen: boolean
}

export function StationDetailModal({ station, onClose, isOpen }: StationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<number>(1)

  if (!station || !isOpen) return null

  // 충전소 상태에 따른 색상 및 텍스트
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { color: "bg-green-500", text: "사용가능" }
      case "INACTIVE":
        return { color: "bg-red-500", text: "사용중" }
      case "MAINTENANCE":
        return { color: "bg-yellow-500", text: "수리중" }
      default:
        return { color: "bg-black", text: "사용중지" }
    }
  }

  const statusInfo = getStatusInfo(station.status)

  // 모의 데이터 - 실제 구현에서는 API에서 가져와야 함
  const mockData = {
    batteryPercentage: 75.28,
    totalUsage: 5825,
    totalPower: 215,
    totalRevenue: 123456,
    usageHistory: Array(6).fill({
      startTime: "2025/04/19 12:24:22",
      endTime: "2025/04/19 12:54:20",
      usageKwh: 30.201,
      maxPower: 10400,
      userType: "개인 일반",
      cardNumber: "ASGM-828910",
      carId: "00",
    }),
    chargingHistory: [
      {
        date: "2025/02/19",
        time: "08:12:32",
        power: "735.102(KWh)",
        price: "365.7(KRW)",
        transactionId: "CSG-28975-CH",
      },
      {
        date: "2025/02/19",
        time: "08:12:32",
        power: "735.102(KWh)",
        price: "365.7(KRW)",
        transactionId: "CSG-28975-CH",
      },
      {
        date: "2025/02/19",
        time: "08:12:32",
        power: "735.102(KWh)",
        price: "365.7(KRW)",
        transactionId: "CSG-28975-CH",
      },
      {
        date: "2025/02/19",
        time: "08:12:32",
        power: "735.102(KWh)",
        price: "365.7(KRW)",
        transactionId: "CSG-28975-CH",
      },
      {
        date: "2025/02/19",
        time: "08:12:32",
        power: "735.102(KWh)",
        price: "365.7(KRW)",
        transactionId: "CSG-28975-CH",
      },
    ],
    priceHistory: [
      { date: "2025/03/20", time: "00:11:00", price: "13,911,122", change: "+68.29" },
      { date: "2025/03/21", time: "00:10:00", price: "13,700,000", change: "-200,000" },
      { date: "2025/03/22", time: "00:09:00", price: "13,900,000", change: "+100,000" },
      { date: "2025/03/23", time: "00:08:00", price: "13,800,000", change: "+100,100" },
      { date: "2025/03/24", time: "00:07:00", price: "13,700,000", change: "+200,000" },
    ],
    stationDetails: {
      chargeTime: "03/19 11:11:11",
      totalPower: "30.201(kWh)",
      chargeEndTime: "03/19 11:11:41",
      maxPower: "9,999(KW)",
      cardNumber: "9,999(KRW)",
      occupancyRate: "56.03%",
      carId: "01",
      transactionId: "TC130295",
      totalRevenue: "10,255(KWh)",
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[90%] max-w-[1200px] h-[90vh] bg-zinc-900 rounded-lg overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold">{station.stationName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-700 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 왼쪽 패널 - ESS 배터리 상태 */}
          <div className="bg-zinc-800 rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center">{station.stationName}</h3>

            <div className="mb-4">
              <h4 className="text-sm text-zinc-400 mb-2">ESS 배터리 상태</h4>
              <div className="flex justify-center">
                <div className="relative w-48 h-20 border-2 border-white rounded-r-full rounded-l-full flex items-center justify-center">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-l-full"
                    style={{ width: `${mockData.batteryPercentage}%` }}
                  ></div>
                  <span className="relative z-10 text-xl font-bold">{mockData.batteryPercentage}%</span>
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-white rounded-r-sm"></div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-zinc-400 mb-2">충전 정보</h4>
              <div className="grid grid-cols-4 text-center text-xs border-b border-zinc-700 py-1">
                <div>충전일 시간</div>
                <div>충전량</div>
                <div>거래금액</div>
                <div>트랜잭션</div>
              </div>
              {mockData.chargingHistory.map((item, index) => (
                <div key={index} className="grid grid-cols-4 text-center text-xs border-b border-zinc-700 py-1">
                  <div>
                    {item.date} {item.time}
                  </div>
                  <div>{item.power}</div>
                  <div>{item.price}</div>
                  <div>{item.transactionId}</div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-zinc-400 mb-2">충전 요금</h4>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm">현재 가격</div>
                <div className="text-green-500 font-bold">₩ {mockData.priceHistory[0].price}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm">변동</div>
                <div className="text-green-500">▲ {mockData.priceHistory[0].change}</div>
              </div>

              <div className="mt-4">
                {mockData.priceHistory.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 text-xs border-b border-zinc-700 py-2">
                    <div>
                      {item.date} {item.time}
                    </div>
                    <div className="text-right">{item.price}</div>
                    <div className={`text-right ${Number(item.change) >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {Number(item.change) >= 0 ? "+" : ""}
                      {item.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-zinc-400 mb-2">충전 시간대 정보</h4>
              <div className="h-32 bg-zinc-700 rounded-lg flex items-center justify-center">
                <span className="text-xs text-zinc-400">충전 시간대 그래프</span>
              </div>
            </div>
          </div>

          {/* 중앙 패널 - 사용 내역 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                <span className="font-bold">01</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${statusInfo.color} mr-2`}></div>
              <span>{statusInfo.text}</span>
            </div>

            <h4 className="text-sm text-zinc-400 mb-2">사용 내역</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="py-1 text-left">충전 시작 시간</th>
                    <th className="py-1 text-left">충전 완료 시간</th>
                    <th className="py-1 text-left">충전량</th>
                    <th className="py-1 text-left">최대 가격</th>
                    <th className="py-1 text-left">사용자 타입</th>
                    <th className="py-1 text-left">카드 번호</th>
                    <th className="py-1 text-left">차량 코드</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.usageHistory.map((item, index) => (
                    <tr key={index} className="border-b border-zinc-700">
                      <td className="py-1">{item.startTime}</td>
                      <td className="py-1">{item.endTime}</td>
                      <td className="py-1">{item.usageKwh}(kWh)</td>
                      <td className="py-1">{item.maxPower}(KW)</td>
                      <td className="py-1">{item.userType}</td>
                      <td className="py-1">{item.cardNumber}</td>
                      <td className="py-1">{item.carId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h4 className="text-sm text-zinc-400 mb-2">월별 사용 내역</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{mockData.totalUsage}</div>
                  <div className="text-xs text-zinc-400">총 충전 건수(MWh)</div>
                  <div className="text-xs text-green-500 mt-2">+3% from yesterday</div>
                </div>
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{mockData.totalPower}</div>
                  <div className="text-xs text-zinc-400">총 이용자(명)</div>
                  <div className="text-xs text-green-500 mt-2">+6% from yesterday</div>
                </div>
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{mockData.totalRevenue.toLocaleString()}</div>
                  <div className="text-xs text-zinc-400">총 수익(₩)</div>
                  <div className="text-xs text-green-500 mt-2">+3% from yesterday</div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 패널 - 상세 정보 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                <span className="font-bold">02</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${statusInfo.color} mr-2`}></div>
              <span>{statusInfo.text}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-zinc-400">충전 시작 시간</div>
                <div>{mockData.stationDetails.chargeTime}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">충전 전력량</div>
                <div>{mockData.stationDetails.totalPower}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">충전 완료 예상 시간</div>
                <div>{mockData.stationDetails.chargeEndTime}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">예상 가능 비용</div>
                <div>{mockData.stationDetails.maxPower}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">처리 상태 정보</div>
                <div className="text-green-500">승인완료</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">승인번호</div>
                <div>{mockData.stationDetails.cardNumber}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">차량 정보</div>
                <div>{mockData.stationDetails.transactionId}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">오류코드</div>
                <div>{mockData.stationDetails.carId}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">현재 충전 상태</div>
                <div>{mockData.stationDetails.occupancyRate}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">전체 충전 요금액</div>
                <div>{mockData.stationDetails.totalRevenue}</div>
              </div>
            </div>

            <h4 className="text-sm text-zinc-400 mb-2">사용 내역</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="py-1 text-left">충전 시작 시간</th>
                    <th className="py-1 text-left">충전 완료 시간</th>
                    <th className="py-1 text-left">충전량</th>
                    <th className="py-1 text-left">최대 가격</th>
                    <th className="py-1 text-left">사용자 타입</th>
                    <th className="py-1 text-left">카드 번호</th>
                    <th className="py-1 text-left">차량 코드</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.usageHistory.slice(0, 6).map((item, index) => (
                    <tr key={index} className="border-b border-zinc-700">
                      <td className="py-1">{item.startTime}</td>
                      <td className="py-1">{item.endTime}</td>
                      <td className="py-1">{item.usageKwh}(kWh)</td>
                      <td className="py-1">{item.maxPower}(KW)</td>
                      <td className="py-1">{item.userType}</td>
                      <td className="py-1">{item.cardNumber}</td>
                      <td className="py-1">{item.carId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarIcon, FilterX } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// 충전소와 충전기 타입 정의
interface Station {
  id: string
  name: string
}

interface Charger {
  id: string
  name: string
  stationId: string
}

// 목업 데이터
const mockStations: Station[] = [
  { id: "STATION001", name: "세종대학교 충전소" },
  { id: "STATION002", name: "광진구 충전소" },
  { id: "STATION003", name: "강남 충전소" },
]

const mockChargers: Charger[] = [
  { id: "CHARGER001", name: "충전기 1", stationId: "STATION001" },
  { id: "CHARGER002", name: "충전기 2", stationId: "STATION001" },
  { id: "CHARGER003", name: "충전기 1", stationId: "STATION002" },
  { id: "CHARGER004", name: "충전기 1", stationId: "STATION003" },
  { id: "CHARGER005", name: "충전기 2", stationId: "STATION003" },
]

// 폼 스키마 정의
const filterFormSchema = z.object({
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  messageType: z.string().nullable(),
  direction: z.string().nullable(),
  stationId: z.string().nullable(),
  chargerId: z.string().nullable(),
})

type FilterFormValues = z.infer<typeof filterFormSchema>

interface OcppLogFilterProps {
  onFilter: (
    startDate: string | undefined,
    endDate: string | undefined,
    messageType: string | undefined,
    direction: "incoming" | "outgoing" | undefined,
    stationId: string | undefined,
    chargerId: string | undefined,
  ) => void
}

export function OcppLogFilter({ onFilter }: OcppLogFilterProps) {
  const [stations, setStations] = useState<Station[]>([])
  const [chargers, setChargers] = useState<Charger[]>([])
  const [filteredChargers, setFilteredChargers] = useState<Charger[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      startDate: null,
      endDate: null,
      messageType: null,
      direction: null,
      stationId: null,
      chargerId: null,
    },
  })

  // 충전소 목록 가져오기
  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true)
      try {
        // 실제 API 호출로 대체해야 함
        // const response = await fetch('/api/stations')
        // const data = await response.json()
        // setStations(data)

        // 목업 데이터 사용
        setStations(mockStations)
      } catch (error) {
        console.error("Error fetching stations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [])

  // 충전기 목록 가져오기
  useEffect(() => {
    const fetchChargers = async () => {
      setLoading(true)
      try {
        // 실제 API 호출로 대체해야 함
        // const response = await fetch('/api/chargers')
        // const data = await response.json()
        // setChargers(data)

        // 목업 데이터 사용
        setChargers(mockChargers)
      } catch (error) {
        console.error("Error fetching chargers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChargers()
  }, [])

  // 선택된 충전소에 따라 충전기 필터링
  useEffect(() => {
    const stationId = form.watch("stationId")
    if (stationId) {
      setFilteredChargers(chargers.filter((charger) => charger.stationId === stationId))
    } else {
      setFilteredChargers(chargers)
    }
  }, [form.watch("stationId"), chargers])

  const onSubmit = (values: FilterFormValues) => {
    // direction 타입 체크 수정
    let directionValue: "incoming" | "outgoing" | undefined = undefined
    if (values.direction === "incoming" || values.direction === "outgoing") {
      directionValue = values.direction
    }

    onFilter(
      values.startDate ? format(values.startDate, "yyyy-MM-dd") : undefined,
      values.endDate ? format(values.endDate, "yyyy-MM-dd") : undefined,
      values.messageType === "all" ? undefined : values.messageType || undefined,
      directionValue,
      values.stationId === "all" ? undefined : values.stationId || undefined,
      values.chargerId === "all" ? undefined : values.chargerId || undefined,
    )
  }

  const handleReset = () => {
    form.reset({
      startDate: null,
      endDate: null,
      messageType: null,
      direction: null,
      stationId: null,
      chargerId: null,
    })
    onFilter(undefined, undefined, undefined, undefined, undefined, undefined)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 날짜 필터 */}
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>시작일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "yyyy-MM-dd") : <span>날짜 선택</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || (form.watch("endDate") ? date > form.watch("endDate")! : false)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>종료일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "yyyy-MM-dd") : <span>날짜 선택</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || (form.watch("startDate") ? date < form.watch("startDate")! : false)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          {/* 메시지 타입 및 방향 필터 */}
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="messageType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>메시지 타입</FormLabel>
                  <Select value={field.value || "all"} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="모든 메시지 타입" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="MeterValuesRequest">MeterValuesRequest</SelectItem>
                      <SelectItem value="MeterValues">MeterValues</SelectItem>
                      <SelectItem value="StartTransactionRequest">StartTransactionRequest</SelectItem>
                      <SelectItem value="StartTransaction">StartTransaction</SelectItem>
                      <SelectItem value="StopTransactionRequest">StopTransactionRequest</SelectItem>
                      <SelectItem value="StopTransaction">StopTransaction</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>방향</FormLabel>
                  <Select value={field.value || "all"} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="모든 방향" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="incoming">수신</SelectItem>
                      <SelectItem value="outgoing">송신</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* 충전소 및 충전기 필터 */}
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="stationId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>충전소</FormLabel>
                  <Select
                    value={field.value || "all"}
                    onValueChange={(value) => {
                      field.onChange(value)
                      // 충전소가 변경되면 충전기 선택 초기화
                      if (value !== form.watch("stationId")) {
                        form.setValue("chargerId", "all")
                      }
                    }}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="모든 충전소" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chargerId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>충전기</FormLabel>
                  <Select
                    value={field.value || "all"}
                    onValueChange={field.onChange}
                    disabled={loading || !form.watch("stationId") || form.watch("stationId") === "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="모든 충전기" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {filteredChargers.map((charger) => (
                        <SelectItem key={charger.id} value={charger.id}>
                          {charger.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleReset} className="flex items-center">
            <FilterX className="mr-2 h-4 w-4" />
            필터 초기화
          </Button>
          <Button type="submit">필터 적용</Button>
        </div>
      </form>
    </Form>
  )
}

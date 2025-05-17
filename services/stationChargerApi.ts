import { API_BASE_URL } from "./apiConfig";

export interface Station {
  id: string;
  name: string;
  location: string;
  status: string;
}

export interface Charger {
  id: string;
  name: string;
  stationId: string;
  type: string;
  status: string;
}

export async function fetchStations(): Promise<Station[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/stations`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching stations:", error);

    // 개발용 목업 데이터
    return [
      {
        id: "STATION001",
        name: "세종대학교 충전소",
        location: "서울시 광진구",
        status: "active",
      },
      {
        id: "STATION002",
        name: "강변 충전소",
        location: "서울시 광진구",
        status: "active",
      },
      {
        id: "STATION003",
        name: "건대입구 충전소",
        location: "서울시 광진구",
        status: "active",
      },
      {
        id: "STATION004",
        name: "어린이대공원 충전소",
        location: "서울시 광진구",
        status: "inactive",
      },
      {
        id: "STATION005",
        name: "군자 충전소",
        location: "서울시 광진구",
        status: "maintenance",
      },
    ];
  }
}

export async function fetchChargersByStation(
  stationId: string
): Promise<Charger[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/stations/${stationId}/chargers`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chargers: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching chargers:", error);

    // 개발용 목업 데이터
    const mockChargers: Record<string, Charger[]> = {
      STATION001: [
        {
          id: "CHARGER001",
          name: "충전기 1",
          stationId: "STATION001",
          type: "DC_FAST",
          status: "available",
        },
        {
          id: "CHARGER002",
          name: "충전기 2",
          stationId: "STATION001",
          type: "AC_SLOW",
          status: "charging",
        },
      ],
      STATION002: [
        {
          id: "CHARGER003",
          name: "충전기 1",
          stationId: "STATION002",
          type: "DC_FAST",
          status: "available",
        },
      ],
      STATION003: [
        {
          id: "CHARGER004",
          name: "충전기 1",
          stationId: "STATION003",
          type: "AC_SLOW",
          status: "available",
        },
        {
          id: "CHARGER005",
          name: "충전기 2",
          stationId: "STATION003",
          type: "DC_FAST",
          status: "faulted",
        },
      ],
      STATION004: [
        {
          id: "CHARGER006",
          name: "충전기 1",
          stationId: "STATION004",
          type: "AC_SLOW",
          status: "unavailable",
        },
      ],
      STATION005: [
        {
          id: "CHARGER007",
          name: "충전기 1",
          stationId: "STATION005",
          type: "DC_FAST",
          status: "unavailable",
        },
        {
          id: "CHARGER008",
          name: "충전기 2",
          stationId: "STATION005",
          type: "AC_SLOW",
          status: "unavailable",
        },
      ],
    };

    return mockChargers[stationId] || [];
  }
}

interface StationStat {
  count: number
  color: string
}

interface Station {
  id: number
  status: string
  name: string
  subName: string
  address: string
  subAddress: string
  registDate: string
  stats: StationStat[]
}

interface StationListProps {
  stations: Station[]
}

export function StationList({ stations }: StationListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {stations.map((station) => (
            <tr key={station.id} className="border-b border-zinc-700">
              <td className="py-3 text-green-500">{station.status}</td>
              <td className="py-3">
                <div>{station.name}</div>
                <div className="text-xs text-zinc-400">{station.subName}</div>
              </td>
              <td className="py-3">
                <div>{station.address}</div>
                <div className="text-xs text-zinc-400">{station.subAddress}</div>
              </td>
              <td className="py-3">Regist Date {station.registDate}</td>
              <td className="py-3">
                <div className="flex items-center space-x-2">
                  {station.stats.map((stat, i) => (
                    <div key={i} className="flex items-center">
                      <div
                        className={`${stat.color} text-white w-5 h-5 rounded-full flex items-center justify-center text-xs`}
                      >
                        {stat.count}
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

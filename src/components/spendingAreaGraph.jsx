"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"

const chartData = [
  { month: "Jan", amount: 186 },
  { month: "Feb", amount: 305 },
  { month: "Mar", amount: 237 },
  { month: "Apr", amount: 73 },
  { month: "May", amount: 209 },
  { month: "Jun", amount: 214 },
]

export function SpendingAreaGraph({ title, description, data = chartData, color = "#2563eb" }) {
  return (
    <div className="w-full h-[420px] bg-white border border-gray-400 rounded-2xl p-4 flex flex-col">
      <div className="mb-2 text-sm">{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

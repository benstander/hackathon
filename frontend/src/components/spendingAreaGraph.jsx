"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"

// Generate data for a few spread-out days in the current month
const generateSpreadOutMonthData = () => {
  const today = new Date().getDate();
  const possibleDays = [1, 7, 14, 21, 28];
  // Only include days up to today
  const days = possibleDays.filter(day => day <= today);
  return days.map(day => ({
    day,
    amount: Math.floor(Math.random() * 200) + 50 // Random spending between 50 and 250
  }));
};

export function SpendingAreaGraph({ title, description, data = generateSpreadOutMonthData(), color = "#2563eb" }) {
  // Calculate total spent
  const totalSpent = data.reduce((sum, d) => sum + d.amount, 0);
  // For below-graph days
  const daysArray = data.map(d => d.day);
  // Get current month name
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="w-full h-[420px] bg-white rounded-2xl p-4 flex flex-col">
      {/* Title, total, and month, perfectly aligned with card padding */}
      <div className="flex flex-col items-start">
        <div className="mb-1 text-sm">{title}</div>
        <div className="text-2xl font-regular text-black">${totalSpent.toLocaleString()}</div>
        <div className="mb-2 flex items-center gap-2 mt-2">
        </div>
      </div>
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
            dataKey="day"
            ticks={daysArray}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 0, right: 0 }}
            tick={({ x, y, payload, index, ...rest }) => (
              <text
                x={x}
                y={y}
                textAnchor={index === 0 ? 'start' : 'middle'}
                fill="#000"
                fontSize={12}
                {...rest}
              >
                {payload.value}
              </text>
            )}
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
      {/* Days of the month below the graph, aligned with card padding */}
      <div className="flex justify-between mt-2 text-xs text-gray-400 select-none">
        {daysArray.map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  )
}

"use client"

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "March", current: 186, projected: 80 },
  { month: "April", current: 305, projected: 200 },
  { month: "May", current: 237, projected: 120 },
];

export function BudgetChart() {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-2 flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 30, right: 16, left: 16, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => value.slice(0, 3)} />
            <Tooltip />
            <Legend wrapperStyle={{ marginTop: 24 }} />
            <Bar dataKey="current" fill="#008000" radius={4} />
            <Bar dataKey="projected" fill="#d1d5db" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

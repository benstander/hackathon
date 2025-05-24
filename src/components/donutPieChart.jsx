"use client"

import React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

const chartData = [
  { name: "Chrome", value: 275, color: "#000" },
  { name: "Safari", value: 200, color: "#4B5563" },
  { name: "Firefox", value: 187, color: "#9CA3AF" },
  { name: "Edge", value: 173, color: "#D1D5DB" },
  { name: "Other", value: 90, color: "#F3F4F6" },
];

export function DonutPieChart() {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-2 flex flex-col">
    <div className="mb-2 text-sm">BUDGET ALLOCATION</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={160}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

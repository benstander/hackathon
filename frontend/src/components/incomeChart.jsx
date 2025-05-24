"use client"

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "March", income: 186 },
  { month: "April", income: 305 },
  { month: "May", income: 237 },
];

export function IncomeChart() {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-2 flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 30, right: 16, left: 16, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => value.slice(0, 3)} />
            <Tooltip />
            <Legend wrapperStyle={{ marginTop: 24 }} />
            <Bar dataKey="income" fill="#000" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
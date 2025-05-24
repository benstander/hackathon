"use client"

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "March", income: 186 },
  { month: "April", income: 305 },
  { month: "May", income: 237 },
  { month: "June", income: 237 },
  { month: "July", income: 237 },
  { month: "August", income: 237 },
];

export function IncomeChart() {
  // Calculate total income
  const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);

  return (
    <div className="w-full h-full bg-white rounded-2xl p-8 flex flex-col">
      {/* Title and total amount - standardized for alignment */}
      <div className="flex flex-col items-start mb-4">
        <div className="mb-2 text-sm">Monthly Spending</div>
        <div className="text-2xl font-regular text-black">${totalIncome.toLocaleString()}</div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
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
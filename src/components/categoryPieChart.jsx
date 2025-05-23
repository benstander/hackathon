"use client"

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Food', value: 400, color: '#000000' },      // Black
  { name: 'Transport', value: 300, color: '#4B5563' },  // Dark grey
  { name: 'Entertainment', value: 300, color: '#9CA3AF' }, // Medium grey
  { name: 'Shopping', value: 200, color: '#D1D5DB' },   // Light grey
  { name: 'Bills', value: 100, color: '#F3F4F6' },      // Very light grey
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-gray-600">{`${((data.value / 1300) * 100).toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

export function CategoryPieChart() {
  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps<T> {
  data: T[];
  dataKey: keyof T;
  color?: string;
}

const ProgressChart = <T extends object,>({ data, dataKey, color = '#d97706' }: ProgressChartProps<T>) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2c2c34" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid #2c2c34' }} 
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Line type="monotone" dataKey={dataKey as string} stroke={color} strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;

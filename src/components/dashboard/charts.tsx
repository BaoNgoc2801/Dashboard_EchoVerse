"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartProps = {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  categories: string[];
  colors: string[];
  showLegend?: boolean;
};

export function AreaChart({
  data,
  xAxisKey,
  yAxisKey,
  categories,
  colors,
  showLegend = true,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsAreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            // Format the date to show only day and month
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
          className="text-muted-foreground text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground text-xs"
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const date = new Date(label);
              const formattedDate = date.toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">{formattedDate}</div>
                    <div className="font-medium text-right">
                      {payload[0].value}
                    </div>
                  </div>
                </div>
              );
            }
            
            return null;
          }}
        />
        {showLegend && <Legend />}
        
        {categories.map((category, index) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            fill={`hsl(var(--${colors[index % colors.length]}))`}
            stroke={`hsl(var(--${colors[index % colors.length]}))`}
            fillOpacity={0.2}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export function BarChart({
  data,
  xAxisKey,
  yAxisKey,
  categories,
  colors,
  showLegend = true,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey={xAxisKey}
          scale="band"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            // Format the date to show only day and month
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
          className="text-muted-foreground text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground text-xs"
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const date = new Date(label);
              const formattedDate = date.toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">{formattedDate}</div>
                    <div className="font-medium text-right">
                      {payload[0].value}
                    </div>
                  </div>
                </div>
              );
            }
            
            return null;
          }}
        />
        {showLegend && <Legend />}
        
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={`hsl(var(--${colors[index % colors.length]}))`}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
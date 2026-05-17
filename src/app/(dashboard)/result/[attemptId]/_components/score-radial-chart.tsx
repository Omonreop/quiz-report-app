"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartConfig = {
  score: {
    label: "Score",
  },
  percentage: {
    label: "Percentage",
    color: "var(--chart-score)",
  },
} satisfies ChartConfig;

export default function ScoreRadialChart({ percentage }: { percentage: number }) {
  const chartData = [
    {
      name: "score",
      percentage,
      fill: "var(--color-percentage)",
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="size-32">
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + (percentage / 100) * 360}
        innerRadius={42}
        outerRadius={58}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-card"
          polarRadius={[58, 42]}
        />
        <RadialBar dataKey="percentage" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-semibold"
                    >
                      {percentage}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      score
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

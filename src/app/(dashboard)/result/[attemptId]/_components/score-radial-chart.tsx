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

export default function ScoreRadialChart({
  percentage,
  size = "default",
}: {
  percentage: number;
  size?: "sm" | "default" | "lg";
}) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  const chartData = [
    {
      name: "score",
      percentage: safePercentage,
      fill: "var(--color-percentage)",
    },
  ];

  const sizeClass = {
    sm: "size-28",
    default: "size-36",
    lg: "size-44",
  }[size];

  const innerRadius = size === "lg" ? 54 : size === "sm" ? 36 : 44;
  const outerRadius = size === "lg" ? 72 : size === "sm" ? 50 : 62;

  return (
    <div className="relative flex items-center justify-center rounded-full bg-teal-500/5 p-2 ring-1 ring-teal-500/10">
      <ChartContainer config={chartConfig} className={sizeClass}>
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={90 - (safePercentage / 100) * 360}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted/70 last:fill-background"
            polarRadius={[outerRadius, innerRadius]}
          />

          <RadialBar
            dataKey="percentage"
            background={{
              fill: "var(--muted)",
            }}
            cornerRadius={999}
          />

          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                  return null;
                }

                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 4}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {safePercentage}%
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 22}
                      className="fill-muted-foreground text-xs font-medium"
                    >
                      score
                    </tspan>
                  </text>
                );
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AttemptApiResponse } from "@/types/quiz";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

function formatCategory(category: string) {
  return category
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function CategoryScoreChart({
  data,
}: {
  data: AttemptApiResponse["categoryBreakdown"];
}) {
  const chartConfig = {
    score: {
      label: "Score",
      color: "var(--chart-score)",
    },
    maxScore: {
      label: "Max possible",
      color: "var(--chart-maximum)",
    },
  } satisfies ChartConfig;
  const chartData = data.map((category) => ({
    ...category,
    category: formatCategory(category.category),
  }));
  const chartMax = Math.max(...data.map((category) => category.maxScore), 1);

  return (
    <ChartContainer config={chartConfig} className="min-h-72 w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        barGap={8}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          domain={[0, chartMax]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
        <Bar dataKey="maxScore" fill="var(--color-maxScore)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

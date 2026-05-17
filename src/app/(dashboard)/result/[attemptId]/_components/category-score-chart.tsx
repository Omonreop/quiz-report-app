"use client";

import {
  ChartConfig,
  ChartContainer,
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
    <ChartContainer config={chartConfig} className="h-52 w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
        barGap={6}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          domain={[0, chartMax]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
        <Bar dataKey="maxScore" fill="var(--color-maxScore)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

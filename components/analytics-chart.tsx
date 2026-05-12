import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "./ui/tabs";
import { HabitLog } from "@/db/schemas/habit-log.schema";
import { Habit } from "@/db/schemas/habit.schema";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

// ─── helpers ────────────────────────────────────────────────────────────────

/** completion % for a single log entry vs its habit goal */
function pct(value: number, goal: number) {
  return Math.min(Math.round((value / goal) * 100), 100);
}

function barColor(p: number) {
  if (p >= 100) return "var(--color-success)";
  if (p >= 60) return "var(--color-warn)";
  return "var(--color-fail)";
}

// ─── data builders ──────────────────────────────────────────────────────────

type ChartPoint = { label: string; pct: number };

function buildDailyData(logs: HabitLog[], habits: Habit[]): ChartPoint[] {
  // last 14 days
  const days: ChartPoint[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const dayLogs = logs.filter(l => l.date === date);

    if (dayLogs.length === 0 || habits.length === 0) {
      days.push({ label: dayjs(date).format('DD/MM'), pct: 0 });
      continue;
    }

    // For "All Habits", calculate average of individual habit percentages
    const percentages: number[] = [];

    for (const habit of habits) {
      const log = dayLogs.find(l => l.habitId === habit.id);
      if (log) {
        const habitPercentage = Math.min(Math.round((log.value / habit.goal) * 100), 100);
        percentages.push(habitPercentage);
      }
    }

    const avgPercentage = percentages.length > 0
      ? Math.round(percentages.reduce((sum, pct) => sum + pct, 0) / percentages.length)
      : 0;

    days.push({ label: dayjs(date).format('DD/MM'), pct: avgPercentage });
  }
  return days;
}

function buildWeeklyData(logs: HabitLog[], habits: Habit[]): ChartPoint[] {
  const weeks: ChartPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const weekStart = dayjs().subtract(i, 'week').startOf('isoWeek');
    const weekEnd = weekStart.endOf('isoWeek');
    const label = `W${weekStart.isoWeek()}`;

    const weekLogs = logs.filter(l => {
      const d = dayjs(l.date);
      return d.isAfter(weekStart.subtract(1, 'day')) && d.isBefore(weekEnd.add(1, 'day'));
    });

    if (weekLogs.length === 0 || habits.length === 0) {
      weeks.push({ label, pct: 0 });
      continue;
    }

    // For "All Habits", calculate average of individual habit percentages for the week
    const weeklyPercentages: number[] = [];

    for (const habit of habits) {
      const habitWeekLogs = weekLogs.filter(l => l.habitId === habit.id);
      if (habitWeekLogs.length > 0) {
        const totalDone = habitWeekLogs.reduce((sum, log) => Math.min(log.value, habit.goal), 0);
        const weeklyGoal = habit.goal * 7; // 7 days in a week
        const habitPercentage = Math.min(Math.round((totalDone / weeklyGoal) * 100), 100);
        weeklyPercentages.push(habitPercentage);
      }
    }

    const avgPercentage = weeklyPercentages.length > 0
      ? Math.round(weeklyPercentages.reduce((sum, pct) => sum + pct, 0) / weeklyPercentages.length)
      : 0;

    weeks.push({ label, pct: avgPercentage });
  }
  return weeks;
}

function buildMonthlyData(logs: HabitLog[], habits: Habit[]): ChartPoint[] {
  const months: ChartPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month');
    const monthStr = month.format('YYYY-MM');
    const label = month.format('MMM');
    const daysInMonth = month.daysInMonth();

    const monthLogs = logs.filter(l => l.date.startsWith(monthStr));

    if (monthLogs.length === 0 || habits.length === 0) {
      months.push({ label, pct: 0 });
      continue;
    }

    // For "All Habits", calculate average of individual habit percentages for the month
    const monthlyPercentages: number[] = [];

    for (const habit of habits) {
      const habitMonthLogs = monthLogs.filter(l => l.habitId === habit.id);
      if (habitMonthLogs.length > 0) {
        const totalDone = habitMonthLogs.reduce((sum, log) => Math.min(log.value, habit.goal), 0);
        const monthlyGoal = habit.goal * daysInMonth;
        const habitPercentage = Math.min(Math.round((totalDone / monthlyGoal) * 100), 100);
        monthlyPercentages.push(habitPercentage);
      }
    }

    const avgPercentage = monthlyPercentages.length > 0
      ? Math.round(monthlyPercentages.reduce((sum, pct) => sum + pct, 0) / monthlyPercentages.length)
      : 0;

    months.push({ label, pct: avgPercentage });
  }
  return months;
}

function avgPct(data: ChartPoint[]) {
  const nonZero = data.filter(d => d.pct > 0);
  if (nonZero.length === 0) return 0;
  return Math.round(nonZero.reduce((s, d) => s + d.pct, 0) / nonZero.length);
}

// ─── chart config ───────────────────────────────────────────────────────────

const chartConfig = {
  pct: { label: "Completion" },
  success: { label: "100%", color: "hsl(var(--chart-2))" },
  warn: { label: "60–99%", color: "hsl(var(--chart-4))" },
  fail: { label: "<60%", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

// ─── sub-chart ───────────────────────────────────────────────────────────────

function CompletionBarChart({ data }: { data: ChartPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(v) => [`${v}%`, "Completion"]} />}
        />
        <Bar dataKey="pct" radius={4} maxBarSize={40}>
          {data.map((entry, i) => (
            <Cell key={i} fill={barColor(entry.pct)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

interface AnalyticsChartProps {
  logs: HabitLog[];
  habits: Habit[];
}

export function AnalyticsChart({ logs, habits }: AnalyticsChartProps) {
  const daily = buildDailyData(logs, habits);
  const weekly = buildWeeklyData(logs, habits);
  const monthly = buildMonthlyData(logs, habits);

  return (
    <Card className="h-fit">
      <Tabs defaultValue="daily">
        <CardHeader className="space-y-root-sm">
          <CardTitle>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </CardTitle>

          <TabsContent value="daily">
            <CardDescription className="px-root-sm">
              Avg completion (last 14 days): <strong>{avgPct(daily)}%</strong>
            </CardDescription>
          </TabsContent>
          <TabsContent value="weekly">
            <CardDescription className="px-root-sm">
              Avg completion (last 12 weeks): <strong>{avgPct(weekly)}%</strong>
            </CardDescription>
          </TabsContent>
          <TabsContent value="monthly">
            <CardDescription className="px-root-sm">
              Avg completion (last 12 months): <strong>{avgPct(monthly)}%</strong>
            </CardDescription>
          </TabsContent>
        </CardHeader>

        <CardContent>
          <TabsContent value="daily">
            <CompletionBarChart data={daily} />
          </TabsContent>
          <TabsContent value="weekly">
            <CompletionBarChart data={weekly} />
          </TabsContent>
          <TabsContent value="monthly">
            <CompletionBarChart data={monthly} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
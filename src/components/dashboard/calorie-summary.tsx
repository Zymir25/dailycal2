'use client';

import { useApp } from '@/context/app-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Flame } from 'lucide-react';
import {
  PolarGrid,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { useMemo } from 'react';

// BMR Estimation using Mifflin-St Jeor equation
const calculateBMR = (user: any) => {
    if (!user.weight || !user.height || !user.age || !user.gender) return 2000;
    const bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + (user.gender === 'male' ? 5 : -161);
    return bmr;
}

const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
}

const calculateTDEE = (user: any) => {
    if(!user.activityLevel) return calculateBMR(user) * 1.2;
    const bmr = calculateBMR(user);
    const multiplier = activityMultipliers[user.activityLevel as keyof typeof activityMultipliers];
    return bmr * multiplier;
}

const calculateCalorieGoal = (user: any) => {
    if(!user.goal) return calculateTDEE(user);
    const tdee = calculateTDEE(user);
    switch (user.goal) {
        case 'lose': return tdee - 500;
        case 'gain': return tdee + 500;
        case 'maintain':
        default: return tdee;
    }
}


export default function CalorieSummary() {
  const { data, getCaloriesForDate } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const consumedCalories = getCaloriesForDate(today);

  const calorieGoal = useMemo(() => {
    if (!data?.user) return 2000;
    return Math.round(calculateCalorieGoal(data.user));
  }, [data?.user]);

  const percentage = Math.min(Math.round((consumedCalories / calorieGoal) * 100), 100);

  const chartData = [{ name: 'Calories', value: percentage, fill: 'var(--color-primary)' }];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Today&apos;s Calories</CardTitle>
        <CardDescription>Your daily intake progress</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square h-full max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
            />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center justify-center gap-1 font-medium leading-none">
          <Flame className="h-4 w-4 text-orange-500" /> 
          <span>{consumedCalories.toLocaleString()} / {calorieGoal.toLocaleString()} kcal</span>
        </div>
        <div className="leading-none text-muted-foreground">
          You&apos;ve consumed {percentage}% of your daily goal.
        </div>
      </CardFooter>
    </Card>
  );
}

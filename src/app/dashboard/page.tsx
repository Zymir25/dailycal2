'use client';

import CalorieSummary from '@/components/dashboard/calorie-summary';
import FoodLogForm from '@/components/dashboard/food-log-form';
import WaterTracker from '@/components/dashboard/water-tracker';
import { useApp } from '@/context/app-context';

export default function DashboardPage() {
  const { data, loading } = useApp();

  if (loading || !data?.user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          Welcome back, {data.user.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">Here&apos;s your summary for today. Keep up the great work!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CalorieSummary />
        <WaterTracker />
      </div>

      <FoodLogForm />
    </div>
  );
}

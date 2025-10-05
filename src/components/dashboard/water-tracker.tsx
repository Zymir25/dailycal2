'use client';

import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GlassWater, Plus } from 'lucide-react';
import { useMemo } from 'react';

const DAILY_GOAL = 8; // 8 glasses of water

export default function WaterTracker() {
  const { addWater, getWaterForDate } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const glasses = getWaterForDate(today);

  const progress = useMemo(() => Math.min((glasses / DAILY_GOAL) * 100, 100), [glasses]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Water Intake</CardTitle>
        <CardDescription>Goal: {DAILY_GOAL} glasses today</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center gap-4">
        <div className="flex items-end gap-2 text-4xl font-bold font-headline text-primary">
          {glasses}
          <span className="text-lg font-medium text-muted-foreground">/ {DAILY_GOAL} glasses</span>
        </div>
        <div className="w-full space-y-2">
            <Progress value={progress} />
            <div className="flex justify-center text-sm text-muted-foreground">
                {Array.from({ length: DAILY_GOAL }).map((_, i) => (
                    <GlassWater key={i} className={`h-6 w-6 mx-1 ${i < glasses ? 'text-blue-400 fill-blue-400' : 'text-gray-300'}`} />
                ))}
            </div>
        </div>
        <Button onClick={() => addWater(today)} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add a Glass
        </Button>
      </CardContent>
    </Card>
  );
}

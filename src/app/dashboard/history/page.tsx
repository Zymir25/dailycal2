'use client';

import { useApp } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { FoodLogItem } from '@/lib/types';
import { Flame, Beef, Wheat, Droplet, Utensils } from 'lucide-react';

const mealIcons = {
  breakfast: '🥞',
  lunch: '🥗',
  dinner: '🍝',
  snack: '🍎',
};

const LogItem = ({ log }: { log: FoodLogItem }) => (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{mealIcons[log.meal]}</span>
                    <h4 className="font-bold capitalize">{log.meal}</h4>
                </div>
                <p className="text-sm text-muted-foreground break-all">{log.query.replace(/\n/g, ', ')}</p>
            </div>
            <div className="flex items-center gap-1 font-bold text-primary">
                <Flame className="h-4 w-4" /> {log.totalCalories} kcal
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Beef className="h-4 w-4"/> P: {log.protein}g</div>
            <div className="flex items-center gap-1"><Wheat className="h-4 w-4"/> C: {log.carbohydrates}g</div>
            <div className="flex items-center gap-1"><Droplet className="h-4 w-4"/> F: {log.fat}g</div>
        </div>
        <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
            <p className="font-semibold">AI Analysis:</p>
            <p>{log.details}</p>
        </div>
    </div>
);

export default function HistoryPage() {
  const { data } = useApp();

  const groupedLogs = useMemo(() => {
    if (!data?.foodLog) return {};
    return data.foodLog.reduce((acc, log) => {
      const date = format(new Date(log.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {} as Record<string, FoodLogItem[]>);
  }, [data?.foodLog]);

  const sortedDates = useMemo(() => Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [groupedLogs]);
  
  const dailyTotals = useMemo(() => {
    return sortedDates.reduce((acc, date) => {
        acc[date] = groupedLogs[date].reduce((totals, log) => {
            totals.calories += log.totalCalories;
            totals.protein += log.protein;
            totals.carbohydrates += log.carbohydrates;
            totals.fat += log.fat;
            return totals;
        }, {calories: 0, protein: 0, carbohydrates: 0, fat: 0});
        return acc;
    }, {} as Record<string, {calories: number, protein: number, carbohydrates: number, fat: number}>)
  }, [groupedLogs, sortedDates]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Food Log History</h1>
        <p className="text-muted-foreground">Review your past meal entries and track your nutritional journey.</p>
      </div>

      {sortedDates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20">
            <Utensils className="h-12 w-12 text-muted-foreground" />
            <CardHeader>
                <CardTitle>No Entries Yet</CardTitle>
                <CardDescription>Start logging your meals to see your history here.</CardDescription>
            </CardHeader>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full" defaultValue={sortedDates[0]}>
          {sortedDates.map((date) => (
            <AccordionItem value={date} key={date}>
              <AccordionTrigger className="text-lg font-headline">
                  <div className="flex justify-between w-full pr-4 items-center">
                    <span>{format(new Date(date), 'EEEE, MMMM d, yyyy')}</span>
                    <span className="text-sm font-normal text-primary flex items-center gap-1">
                        <Flame className="h-4 w-4"/> {dailyTotals[date].calories.toLocaleString()} kcal
                    </span>
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                    {groupedLogs[date].map((log) => (
                      <LogItem key={log.id} log={log} />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

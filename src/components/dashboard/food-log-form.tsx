'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import { calculateCalorieIntake } from '@/ai/flows/calculate-calorie-intake';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';
import CalorieResultDialog from './calorie-result-dialog';
import type { FoodLogItem } from '@/lib/types';


const formSchema = z.object({
  meal: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], {
    required_error: 'Please select a meal type.',
  }),
  foodItems: z.string().min(10, {
    message: 'Please describe what you ate in at least 10 characters.',
  }),
});

export default function FoodLogForm() {
  const { addFoodLog } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Omit<FoodLogItem, 'id' | 'date' | 'query'> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const foodItemsList = values.foodItems.split('\n').map(item => {
        const parts = item.trim().split(/,(.+)/s);
        return {
            quantity: parts.length > 1 ? parts[0].trim() : '1 serving',
            foodName: parts.length > 1 ? parts[1].trim() : parts[0].trim(),
        };
    }).filter(item => item.foodName);


    try {
      const aiResult = await calculateCalorieIntake({
        meal: values.meal,
        foodItems: foodItemsList
      });

      const newLogEntry: Omit<FoodLogItem, 'id' | 'date'> = {
        meal: values.meal,
        query: values.foodItems,
        ...aiResult,
      };
      
      setResult(newLogEntry);
      setIsDialogOpen(true);

    } catch (error) {
      console.error('AI calculation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'We couldn\'t calculate the calories for your entry. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmLog = () => {
    if (result) {
      const newLog: FoodLogItem = {
    id: new Date().toISOString() + Math.random(),
    date: new Date().toISOString(),
    query: '', // <-- add a default value if needed
    ...result
};
      addFoodLog(newLog);
      toast({
        title: 'Meal Logged!',
        description: `Your ${result.meal} has been added to your history.`,
      });
      form.reset({ meal: result.meal, foodItems: '' });
      setIsDialogOpen(false);
      setResult(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Log Your Meal</CardTitle>
          <CardDescription>
            Enter what you ate. You can list items on new lines, like "1 cup, oatmeal". The AI will work its magic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-1">
                   <FormField
                    control={form.control}
                    name="meal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a meal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="foodItems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What did you eat?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. 2 slices, whole wheat bread&#10;1 tbsp, peanut butter&#10;1, medium banana"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate & Log Meal'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <CalorieResultDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        result={result}
        onConfirm={handleConfirmLog}
      />
    </>
  );
}

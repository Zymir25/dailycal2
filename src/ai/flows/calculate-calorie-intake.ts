'use server';
/**
 * @fileOverview This file defines a Genkit flow for calculating the calorie and macro-nutrient intake from food log entries.
 *
 * - calculateCalorieIntake - A function that calculates calorie and macro-nutrient information from food log entries.
 * - CalculateCalorieIntakeInput - The input type for the calculateCalorieIntake function.
 * - CalculateCalorieIntakeOutput - The return type for the calculateCalorieIntake function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodItemSchema = z.object({
  foodName: z.string().describe('The name of the food item.'),
  quantity: z.string().describe('The quantity of the food item consumed (e.g., 1 cup, 2 slices).'),
});

const CalculateCalorieIntakeInputSchema = z.object({
  meal: z.string().describe('The meal (e.g., breakfast, lunch, dinner, snack).'),
  foodItems: z.array(FoodItemSchema).describe('An array of food items consumed during the meal.'),
});
export type CalculateCalorieIntakeInput = z.infer<typeof CalculateCalorieIntakeInputSchema>;

const CalculateCalorieIntakeOutputSchema = z.object({
  totalCalories: z.number().describe('The total number of calories in the meal.'),
  protein: z.number().describe('The total grams of protein in the meal.'),
  carbohydrates: z.number().describe('The total grams of carbohydrates in the meal.'),
  fat: z.number().describe('The total grams of fat in the meal.'),
  details: z.string().describe('Detailed breakdown of each food item and its nutritional information.'),
});
export type CalculateCalorieIntakeOutput = z.infer<typeof CalculateCalorieIntakeOutputSchema>;

export async function calculateCalorieIntake(input: CalculateCalorieIntakeInput): Promise<CalculateCalorieIntakeOutput> {
  return calculateCalorieIntakeFlow(input);
}

const calculateCalorieIntakePrompt = ai.definePrompt({
  name: 'calculateCalorieIntakePrompt',
  input: {schema: CalculateCalorieIntakeInputSchema},
  output: {schema: CalculateCalorieIntakeOutputSchema},
  prompt: `You are a nutritional expert. Analyze the following food log entry and calculate the total calories, protein, carbohydrates, and fat.

Meal: {{{meal}}}
Food Items:
{{#each foodItems}}
  - {{{foodName}}} ({{{quantity}}})
{{/each}}

Provide a detailed breakdown of each food item and its nutritional information, along with the total calorie and macro-nutrient counts.  Make sure the food names are included in the details output.

Format the output as JSON. The output should include totalCalories, protein, carbohydrates, fat, and details.  Do not include units in the numerical values. The numerical values should be numbers and NOT strings.
`,
});

const calculateCalorieIntakeFlow = ai.defineFlow(
  {
    name: 'calculateCalorieIntakeFlow',
    inputSchema: CalculateCalorieIntakeInputSchema,
    outputSchema: CalculateCalorieIntakeOutputSchema,
  },
  async input => {
    const {output} = await calculateCalorieIntakePrompt(input);
    return output!;
  }
);

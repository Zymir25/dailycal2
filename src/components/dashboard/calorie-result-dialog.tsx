import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { FoodLogItem } from '@/lib/types';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';

interface CalorieResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  result: Omit<FoodLogItem, 'id' | 'date' | 'query'> | null;
  onConfirm: () => void;
}

const MacroStat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <div className="flex items-center gap-2 font-bold text-lg">{icon} {value.toLocaleString()}g</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default function CalorieResultDialog({ isOpen, onOpenChange, result, onConfirm }: CalorieResultDialogProps) {
  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center capitalize">{result.meal} Nutrition</DialogTitle>
          <DialogDescription className="text-center">Here is the nutritional breakdown of your meal.</DialogDescription>
        </DialogHeader>
        
        <div className="my-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-4xl font-bold font-headline text-primary">
                <Flame className="h-8 w-8 text-orange-400" />
                {result.totalCalories.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Total Calories</div>
        </div>

        <div className="grid grid-cols-3 gap-4 my-4">
            <MacroStat icon={<Beef className="h-5 w-5 text-red-400"/>} label="Protein" value={result.protein} />
            <MacroStat icon={<Wheat className="h-5 w-5 text-yellow-400"/>} label="Carbs" value={result.carbohydrates} />
            <MacroStat icon={<Droplet className="h-5 w-5 text-blue-400"/>} label="Fat" value={result.fat} />
        </div>

        <Separator />
        
        <div className="prose prose-sm max-h-48 overflow-y-auto rounded-md border p-4 mt-4">
          <h4 className="font-bold">Details</h4>
          <p>{result.details}</p>
        </div>

        <DialogFooter className="sm:justify-between gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
            </Button>
            <Button type="button" onClick={onConfirm}>
                Confirm & Log Meal
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

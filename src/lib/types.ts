export interface UserProfile {
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number; // in kg
  height?: number; // in cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose' | 'maintain' | 'gain';
}

export interface FoodLogItem {
  id: string;
  date: string; // ISO string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  query: string;
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  details: string;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  glasses: number;
}

export interface AppData {
  user: UserProfile | null;
  foodLog: FoodLogItem[];
  waterLog: WaterLog[];
}

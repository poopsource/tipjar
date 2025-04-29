import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function roundToNearestDollar(amount: number): number {
  return Math.round(amount);
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const calculateHourlyRate = (totalAmount: number, totalHours: number): number => {
  if (totalHours === 0) return 0;
  
  // Calculate the hourly rate without any rounding
  const hourlyRate = totalAmount / totalHours;
  
  // Truncate to 2 decimal places without rounding
  // Math.floor(hourlyRate * 100) / 100 truncates to 2 decimal places
  return Math.floor(hourlyRate * 100) / 100;
};

export const calculatePayout = (hours: number, hourlyRate: number): number => {
  return hours * hourlyRate;
};

export const parseManualEntry = (text: string): Array<{ name: string, hours: number }> => {
  const lines = text.trim().split('\n');
  const result: Array<{ name: string, hours: number }> = [];
  
  for (const line of lines) {
    const match = line.match(/^(.*?):\s*(\d+(?:\.\d+)?)$/);
    if (match) {
      const [, name, hoursStr] = match;
      const hours = parseFloat(hoursStr);
      
      if (name.trim() && !isNaN(hours)) {
        result.push({
          name: name.trim(),
          hours: hours
        });
      }
    }
  }
  
  return result;
};

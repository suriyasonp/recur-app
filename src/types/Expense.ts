export type Frequency = 'one-time' | 'daily' | 'monthly' | 'yearly';

export interface Expense {
    id: string;
    name: string;
    amount: number;
    frequency: Frequency;
    date: string; // ISO Date string for one-time, or start date for recurring
    nextPayment?: string; // Calculated for recurring
    category?: string;
    note?: string;
}

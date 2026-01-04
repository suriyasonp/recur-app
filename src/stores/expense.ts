import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Expense } from '../types/Expense';

export const useExpenseStore = defineStore('expense', () => {
    // State
    const expenses = ref<Expense[]>([]);

    // Persistence
    const loadFromStorage = () => {
        const stored = localStorage.getItem('recur_expenses');
        if (stored) {
            expenses.value = JSON.parse(stored);
        }
    };

    const saveToStorage = () => {
        localStorage.setItem('recur_expenses', JSON.stringify(expenses.value));
    };

    // Initialize
    loadFromStorage();
    watch(expenses, saveToStorage, { deep: true });

    // Actions
    function addExpense(expense: Omit<Expense, 'id'>) {
        expenses.value.push({
            ...expense,
            id: crypto.randomUUID()
        });
    }

    function removeExpense(id: string) {
        expenses.value = expenses.value.filter((e: Expense) => e.id !== id);
    }

    function updateExpense(updated: Expense) {
        const index = expenses.value.findIndex((e: Expense) => e.id === updated.id);
        if (index !== -1) {
            expenses.value[index] = updated;
        }
    }

    function importData(json: string) {
        try {
            const data = JSON.parse(json);
            if (Array.isArray(data)) {
                // Basic validation could be added here
                expenses.value = data;
            }
        } catch (e) {
            console.error('Import failed', e);
            throw new Error('Invalid JSON format');
        }
    }

    function exportData(): string {
        return JSON.stringify(expenses.value, null, 2);
    }

    // Getters
    const totalMonthlyRecurring = computed(() => {
        return expenses.value
            .filter((e: Expense) => e.frequency === 'monthly')
            .reduce((sum: number, e: Expense) => sum + e.amount, 0);
    });

    const totalYearlyRecurring = computed(() => {
        return expenses.value
            .filter((e: Expense) => e.frequency === 'yearly')
            .reduce((sum: number, e: Expense) => sum + e.amount, 0);
    });



    return {
        expenses,
        addExpense,
        removeExpense,
        updateExpense,
        importData,
        exportData,
        totalMonthlyRecurring,
        totalYearlyRecurring
    };
});

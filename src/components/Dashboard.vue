<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useExpenseStore } from '../stores/expense';
import { useSettingsStore } from '../stores/settings';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const store = useExpenseStore();
const settings = useSettingsStore();
const router = useRouter();

onMounted(() => {
    store.seedData();
});

// Group expenses by frequency
const yearlyExpenses = computed(() => {
    return store.expenses.filter((e: any) => e.frequency === 'yearly');
});

const monthlyExpenses = computed(() => {
    return store.expenses.filter((e: any) => e.frequency === 'monthly');
});

const dailyExpenses = computed(() => {
    return store.expenses.filter((e: any) => e.frequency === 'daily');
});

const oneTimeExpenses = computed(() => {
    return store.expenses.filter((e: any) => e.frequency === 'one-time');
});

// Calculate totals
const totalYearly = computed(() => {
    return yearlyExpenses.value.reduce((sum: number, e: any) => sum + e.amount, 0);
});

const totalMonthly = computed(() => {
    return monthlyExpenses.value.reduce((sum: number, e: any) => sum + e.amount, 0);
});

const totalDaily = computed(() => {
    return dailyExpenses.value.reduce((sum: number, e: any) => sum + e.amount, 0);
});

const totalOneTime = computed(() => {
    return oneTimeExpenses.value.reduce((sum: number, e: any) => sum + e.amount, 0);
});

const grandTotal = computed(() => {
    return totalYearly.value + (totalMonthly.value * 12) + (totalDaily.value * 365) + totalOneTime.value;
});

// Get category emoji and theme with brighter colors
function getCategoryStyle(category: string | undefined) {
    if (!category) return { emoji: '📌', bg: 'bg-slate-100', iconBg: 'bg-slate-700', textColor: 'text-slate-900' };
    
    const styles: Record<string, { emoji: string; bg: string; iconBg: string; textColor: string }> = {
        'Entertainment': { emoji: '🎬', bg: 'bg-gradient-to-br from-red-100 to-red-50', iconBg: 'bg-gradient-to-br from-red-600 to-red-700', textColor: 'text-red-900' },
        'Streaming': { emoji: '📺', bg: 'bg-gradient-to-br from-rose-100 to-rose-50', iconBg: 'bg-gradient-to-br from-rose-600 to-rose-700', textColor: 'text-rose-900' },
        'Music': { emoji: '🎵', bg: 'bg-gradient-to-br from-green-100 to-green-50', iconBg: 'bg-gradient-to-br from-green-600 to-green-700', textColor: 'text-green-900' },
        'Cloud Storage': { emoji: '☁️', bg: 'bg-gradient-to-br from-sky-100 to-sky-50', iconBg: 'bg-gradient-to-br from-sky-600 to-sky-700', textColor: 'text-sky-900' },
        'Storage': { emoji: '💾', bg: 'bg-gradient-to-br from-blue-100 to-blue-50', iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700', textColor: 'text-blue-900' },
        'Productivity': { emoji: '💼', bg: 'bg-gradient-to-br from-indigo-100 to-indigo-50', iconBg: 'bg-gradient-to-br from-indigo-600 to-indigo-700', textColor: 'text-indigo-900' },
        'Software': { emoji: '💻', bg: 'bg-gradient-to-br from-violet-100 to-violet-50', iconBg: 'bg-gradient-to-br from-violet-600 to-violet-700', textColor: 'text-violet-900' },
        'AI Tools': { emoji: '🤖', bg: 'bg-gradient-to-br from-purple-100 to-purple-50', iconBg: 'bg-gradient-to-br from-purple-600 to-purple-700', textColor: 'text-purple-900' },
        'Development': { emoji: '👨‍💻', bg: 'bg-gradient-to-br from-slate-100 to-slate-50', iconBg: 'bg-gradient-to-br from-slate-700 to-slate-800', textColor: 'text-slate-900' },
        'Fitness': { emoji: '💪', bg: 'bg-gradient-to-br from-orange-100 to-orange-50', iconBg: 'bg-gradient-to-br from-orange-600 to-orange-700', textColor: 'text-orange-900' },
        'Health': { emoji: '🏥', bg: 'bg-gradient-to-br from-teal-100 to-teal-50', iconBg: 'bg-gradient-to-br from-teal-600 to-teal-700', textColor: 'text-teal-900' },
        'Gaming': { emoji: '🎮', bg: 'bg-gradient-to-br from-fuchsia-100 to-fuchsia-50', iconBg: 'bg-gradient-to-br from-fuchsia-600 to-fuchsia-700', textColor: 'text-fuchsia-900' },
        'Games': { emoji: '🎯', bg: 'bg-gradient-to-br from-pink-100 to-pink-50', iconBg: 'bg-gradient-to-br from-pink-600 to-pink-700', textColor: 'text-pink-900' },
        'Reading': { emoji: '📚', bg: 'bg-gradient-to-br from-amber-100 to-amber-50', iconBg: 'bg-gradient-to-br from-amber-600 to-amber-700', textColor: 'text-amber-900' },
        'Books': { emoji: '📖', bg: 'bg-gradient-to-br from-yellow-100 to-yellow-50', iconBg: 'bg-gradient-to-br from-yellow-600 to-yellow-700', textColor: 'text-yellow-900' },
        'News': { emoji: '📰', bg: 'bg-gradient-to-br from-cyan-100 to-cyan-50', iconBg: 'bg-gradient-to-br from-cyan-600 to-cyan-700', textColor: 'text-cyan-900' },
        'Communication': { emoji: '💬', bg: 'bg-gradient-to-br from-lime-100 to-lime-50', iconBg: 'bg-gradient-to-br from-lime-600 to-lime-700', textColor: 'text-lime-900' },
        'Design': { emoji: '🎨', bg: 'bg-gradient-to-br from-pink-100 to-pink-50', iconBg: 'bg-gradient-to-br from-pink-600 to-pink-700', textColor: 'text-pink-900' },
        'Creative': { emoji: '✨', bg: 'bg-gradient-to-br from-purple-100 to-purple-50', iconBg: 'bg-gradient-to-br from-purple-600 to-purple-700', textColor: 'text-purple-900' },
        'Security': { emoji: '🔒', bg: 'bg-gradient-to-br from-emerald-100 to-emerald-50', iconBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700', textColor: 'text-emerald-900' },
        'VPN': { emoji: '🛡️', bg: 'bg-gradient-to-br from-teal-100 to-teal-50', iconBg: 'bg-gradient-to-br from-teal-600 to-teal-700', textColor: 'text-teal-900' },
        'Insurance': { emoji: '🛡️', bg: 'bg-gradient-to-br from-blue-100 to-blue-50', iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700', textColor: 'text-blue-900' },
        'Food': { emoji: '🍔', bg: 'bg-gradient-to-br from-orange-100 to-orange-50', iconBg: 'bg-gradient-to-br from-orange-600 to-orange-700', textColor: 'text-orange-900' },
        'Transport': { emoji: '🚗', bg: 'bg-gradient-to-br from-blue-100 to-blue-50', iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700', textColor: 'text-blue-900' },
        'Shopping': { emoji: '🛍️', bg: 'bg-gradient-to-br from-pink-100 to-pink-50', iconBg: 'bg-gradient-to-br from-pink-600 to-pink-700', textColor: 'text-pink-900' },
        'Education': { emoji: '🎓', bg: 'bg-gradient-to-br from-indigo-100 to-indigo-50', iconBg: 'bg-gradient-to-br from-indigo-600 to-indigo-700', textColor: 'text-indigo-900' },
        'Utilities': { emoji: '⚡', bg: 'bg-gradient-to-br from-yellow-100 to-yellow-50', iconBg: 'bg-gradient-to-br from-yellow-600 to-yellow-700', textColor: 'text-yellow-900' },
        'Subscription': { emoji: '📦', bg: 'bg-gradient-to-br from-violet-100 to-violet-50', iconBg: 'bg-gradient-to-br from-violet-600 to-violet-700', textColor: 'text-violet-900' },
    };
    
    return styles[category] || { emoji: '📌', bg: 'bg-gradient-to-br from-slate-100 to-slate-50', iconBg: 'bg-gradient-to-br from-slate-700 to-slate-800', textColor: 'text-slate-900' };
}

// Calculate yearly equivalent
function getYearlyEquivalent(amount: number, frequency: string): number {
    switch (frequency) {
        case 'monthly': return amount * 12;
        case 'daily': return amount * 365;
        case 'yearly': return amount;
        default: return amount;
    }
}
</script>

<template>
    <div class="max-w-7xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-surface-400 mb-3">
                {{ t('dashboard.title') }}
            </h1>
            <p class="text-xl text-surface-600 dark:text-surface-400 mb-8">
                {{ t('dashboard.spending') }} <span class="font-bold text-primary-600">{{ settings.currencySymbol }}{{ grandTotal.toLocaleString() }}</span>{{ t('dashboard.perYear') }} {{ store.expenses.length }} {{ t('dashboard.expenses') }}
            </p>
            <div class="flex gap-3 justify-center">
                <!-- <Button 
                    label="Add Expense" 
                    icon="pi pi-plus" 
                    size="large"
                    @click="router.push('/expenses')"
                    raised
                /> -->
                <Button 
                    :label="t('dashboard.quickAdd')" 
                    icon="pi pi-bolt" 
                    size="large"
                    raised
                    @click="router.push('/browse')"
                />
                <Button 
                    :label="t('dashboard.viewExpenses')" 
                    icon="pi pi-list" 
                    size="large"
                    outlined
                    @click="router.push('/expenses')"
                />
            </div>
        </div>

        <!-- Expense Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <!-- Expense Cards -->
            <div 
                v-for="expense in store.expenses" 
                :key="expense.id"
                :class="[
                    getCategoryStyle(expense.category).bg,
                    'rounded-[2rem] p-8 flex flex-col justify-between h-72 transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                ]"
                @click="router.push('/expenses')"
            >
                <!-- Top Row: Logo & Frequency Badge -->
                <div class="flex justify-between items-start">
                    <div :class="[getCategoryStyle(expense.category).iconBg, 'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg']">
                        <span class="text-white font-bold text-2xl">
                            {{ getCategoryStyle(expense.category).emoji }}
                        </span>
                    </div>
                    <span class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-surface-700 shadow-md uppercase">
                        {{ expense.frequency }}
                    </span>
                </div>

                <!-- Bottom: Name & Price -->
                <div>
                    <h3 :class="[getCategoryStyle(expense.category).textColor, 'font-bold text-xl mb-2']">
                        {{ expense.name }}
                    </h3>
                    <div class="flex items-baseline gap-1">
                        <span :class="[getCategoryStyle(expense.category).textColor, 'text-5xl font-black tracking-tight']">
                            {{ settings.currencySymbol }}{{ expense.amount.toLocaleString() }}
                        </span>
                    </div>
                    <p :class="[getCategoryStyle(expense.category).textColor, 'font-semibold text-sm mt-2 opacity-80']">
                        <span v-if="expense.frequency === 'monthly'">
                            ~{{ settings.currencySymbol }}{{ getYearlyEquivalent(expense.amount, 'monthly').toLocaleString() }}/yr
                        </span>
                        <span v-else-if="expense.frequency === 'daily'">
                            ~{{ settings.currencySymbol }}{{ getYearlyEquivalent(expense.amount, 'daily').toLocaleString() }}/yr
                        </span>
                        <span v-else-if="expense.frequency === 'yearly'">
                            per year
                        </span>
                        <span v-else>
                            {{ expense.category }}
                        </span>
                    </p>
                </div>
            </div>

            <!-- Empty State -->
            <div 
                v-if="store.expenses.length === 0"
                class="md:col-span-2 bg-white dark:bg-surface-800 rounded-[2rem] p-12 flex flex-col items-center justify-center shadow-lg border-2 border-surface-200 dark:border-surface-700"
            >
                <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">{{ t('dashboard.noExpensesYet') }}</h3>
                <p class="text-surface-500 dark:text-surface-400 mb-6">{{ t('dashboard.startTracking') }}</p>
                <div class="flex gap-3">
                    <Button :label="t('dashboard.addExpense')" icon="pi pi-plus" @click="router.push('/expenses')" />
                    <Button :label="t('dashboard.quickAdd')" icon="pi pi-bolt" outlined @click="router.push('/browse')" />
                </div>
            </div>
        </div>

        <!-- Summary Card -->
        <div 
            v-if="store.expenses.length > 0"
            class="bg-white dark:bg-surface-800 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center shadow-lg border-2 border-surface-200 dark:border-surface-700 gap-6"
        >
            <div class="flex flex-col items-center md:items-start">
                <p class="text-surface-400 dark:text-surface-400 text-xs font-bold tracking-widest uppercase mb-1">{{ t('dashboard.totalMonth') }}</p>
                <p class="text-4xl font-black text-surface-300 dark:text-surface-0 tracking-tight">
                    {{ settings.currencySymbol }}{{ (totalMonthly + (totalDaily * 30) + (totalYearly / 12)).toLocaleString() }}
                </p>
            </div>

            <div class="w-full h-px bg-surface-200 dark:bg-surface-700 md:hidden"></div>

            <div class="flex flex-col items-center md:items-end">
                <p class="text-surface-400 dark:text-surface-400 text-xs font-bold tracking-widest uppercase mb-1">{{ t('dashboard.yearlyProjection') }}</p>
                <p class="text-3xl font-bold text-primary-600">
                    {{ settings.currencySymbol }}{{ grandTotal.toLocaleString() }}
                </p>
            </div>
        </div>
    </div>
</template>

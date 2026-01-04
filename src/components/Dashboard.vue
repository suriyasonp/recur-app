<script setup lang="ts">
import { onMounted, computed, ref, nextTick } from 'vue';
import { useExpenseStore } from '../stores/expense';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Plotly from 'plotly.js-dist-min';
import { useRouter } from 'vue-router';

const store = useExpenseStore();
const router = useRouter();

onMounted(() => {
    store.seedData();
    renderCharts();
});

const yearlyExpenses = computed(() => {
    return store.expenses
        .filter((e: any) => e.frequency === 'yearly')
        .sort((a: any, b: any) => b.amount - a.amount);
});

const monthlyExpenses = computed(() => {
     return store.expenses.filter((e: any) => e.frequency === 'monthly');
});

const totalYearly = computed(() => {
    return store.expenses
        .filter((e: any) => e.frequency === 'yearly')
        .reduce((sum: number, e: any) => sum + e.amount, 0);
});

const totalMonthly = computed(() => {
    return store.expenses
        .filter((e: any) => e.frequency === 'monthly')
        .reduce((sum: number, e: any) => sum + e.amount, 0);
});

const chartContainer = ref<HTMLElement | null>(null);

function renderCharts() {
    nextTick(() => {
        if (!chartContainer.value) return;

        const categories = {} as Record<string, number>;
        monthlyExpenses.value.forEach((e: any) => {
            const cat = e.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + e.amount;
        });

        const data = [{
            x: Object.keys(categories),
            y: Object.keys(categories).map(k => categories[k]),
            type: 'bar',
            marker: {
                color: '#6366f1',
                line: {
                    color: '#4f46e5',
                    width: 1
                }
            }
        }];

        const layout = {
            title: '',
            barmode: 'group',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                family: 'Inter, sans-serif',
                color: '#64748b'
            },
            xaxis: {
                gridcolor: 'rgba(203, 213, 225, 0.3)'
            },
            yaxis: {
                gridcolor: 'rgba(203, 213, 225, 0.3)'
            },
            margin: { t: 20, r: 20, b: 40, l: 60 }
        };

        Plotly.newPlot(chartContainer.value, data as any, layout as any, { responsive: true, displayModeBar: false });
    });
}
</script>

<template>
    <div class="max-w-7xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-surface-900 dark:text-surface-0 mb-3">
                Track Your Recurring Expenses
            </h1>
            <p class="text-xl text-surface-600 dark:text-surface-400 mb-8">
                You're spending <span class="font-bold text-primary-600">฿{{ (totalYearly + (totalMonthly * 12)).toLocaleString() }}</span>/year on {{ store.expenses.length }} subscriptions
            </p>
            <div class="flex gap-3 justify-center">
                <Button 
                    label="Add Expense" 
                    icon="pi pi-plus" 
                    size="large"
                    @click="router.push('/expenses')"
                    raised
                />
                <Button 
                    label="Import Data" 
                    icon="pi pi-upload" 
                    size="large"
                    outlined
                    @click="router.push('/settings')"
                />
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card class="text-center">
                <template #content>
                    <div class="py-4">
                        <div class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-2">
                            Total Yearly
                        </div>
                        <div class="text-4xl font-bold text-primary-600 mb-1">
                            ฿{{ totalYearly.toLocaleString() }}
                        </div>
                        <div class="text-sm text-surface-500">
                            {{ yearlyExpenses.length }} subscriptions
                        </div>
                    </div>
                </template>
            </Card>

            <Card class="text-center">
                <template #content>
                    <div class="py-4">
                        <div class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-2">
                            Total Monthly
                        </div>
                        <div class="text-4xl font-bold text-emerald-600 mb-1">
                            ฿{{ totalMonthly.toLocaleString() }}
                        </div>
                        <div class="text-sm text-surface-500">
                            {{ monthlyExpenses.length }} subscriptions
                        </div>
                    </div>
                </template>
            </Card>

            <Card class="text-center">
                <template #content>
                    <div class="py-4">
                        <div class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-2">
                            Annual Total
                        </div>
                        <div class="text-4xl font-bold text-amber-600 mb-1">
                            ฿{{ (totalYearly + (totalMonthly * 12)).toLocaleString() }}
                        </div>
                        <div class="text-sm text-surface-500">
                            All expenses combined
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <!-- Yearly Subscriptions -->
            <div class="lg:col-span-2">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Yearly Subscriptions</h2>
                    <Button label="View All" text size="small" @click="router.push('/expenses')" />
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card 
                        v-for="expense in yearlyExpenses.slice(0, 6)" 
                        :key="expense.id"
                        class="hover:shadow-lg transition-shadow cursor-pointer"
                        @click="router.push('/expenses')"
                    >
                        <template #content>
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="text-xs text-surface-500 dark:text-surface-400 mb-1">
                                        {{ expense.category }}
                                    </div>
                                    <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0 mb-2">
                                        {{ expense.name }}
                                    </h3>
                                    <div class="text-2xl font-bold text-primary-600">
                                        ฿{{ expense.amount.toLocaleString() }}
                                    </div>
                                    <div class="text-xs text-surface-500 mt-2">
                                        Due: {{ expense.date }}
                                    </div>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                    <i class="pi pi-calendar text-xl"></i>
                                </div>
                            </div>
                        </template>
                    </Card>

                    <!-- Empty state -->
                    <Card v-if="yearlyExpenses.length === 0" class="col-span-2">
                        <template #content>
                            <div class="text-center py-12">
                                <i class="pi pi-inbox text-6xl text-surface-300 mb-4"></i>
                                <p class="text-surface-500 mb-4">No yearly subscriptions yet</p>
                                <Button label="Add Your First Subscription" icon="pi pi-plus" @click="router.push('/expenses')" />
                            </div>
                        </template>
                    </Card>
                </div>
            </div>

            <!-- Monthly Analysis -->
            <div>
                <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-4">Monthly Breakdown</h2>
                <Card>
                    <template #content>
                        <div ref="chartContainer" class="w-full h-[400px]"></div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- Recent Activity -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Recent Activity</h2>
                <Button label="Manage All" text size="small" @click="router.push('/expenses')" />
            </div>
            
            <Card>
                <template #content>
                    <div class="divide-y divide-surface-200 dark:divide-surface-700">
                        <div 
                            v-for="expense in store.expenses.slice(0, 5)" 
                            :key="expense.id"
                            class="py-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 -mx-6 px-6 transition-colors cursor-pointer"
                            @click="router.push('/expenses')"
                        >
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                                    <i class="pi" :class="expense.frequency === 'yearly' ? 'pi-calendar' : 'pi-refresh'"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-surface-900 dark:text-surface-0">{{ expense.name }}</div>
                                    <div class="text-sm text-surface-500 capitalize">{{ expense.frequency }} • {{ expense.category }}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-lg text-surface-900 dark:text-surface-0">฿{{ expense.amount.toLocaleString() }}</div>
                                <div class="text-sm text-surface-500">{{ expense.date }}</div>
                            </div>
                        </div>

                        <!-- Empty state -->
                        <div v-if="store.expenses.length === 0" class="py-12 text-center">
                            <i class="pi pi-inbox text-6xl text-surface-300 mb-4"></i>
                            <p class="text-surface-500 mb-4">No expenses tracked yet</p>
                            <Button label="Get Started" icon="pi pi-plus" @click="router.push('/expenses')" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

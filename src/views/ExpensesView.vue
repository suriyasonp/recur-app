<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useExpenseStore } from '../stores/expense';
import { useSettingsStore } from '../stores/settings';
import type { Expense } from '../types/Expense';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import ExpenseForm from '../components/ExpenseForm.vue';

const { t } = useI18n();
const store = useExpenseStore();
const settings = useSettingsStore();
const confirm = useConfirm();

const formVisible = ref(false);
const selectedExpense = ref<Expense | null>(null);

function openNew() {
    selectedExpense.value = null;
    formVisible.value = true;
}

function openEdit(expense: Expense) {
    selectedExpense.value = { ...expense };
    formVisible.value = true;
}

function deleteItem(expense: Expense) {
    confirm.require({
        message: t('expenses.deleteConfirm'),
        header: t('common.delete'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            store.removeExpense(expense.id);
        }
    });
}

function getFrequencySeverity(freq: string) {
    switch(freq) {
        case 'monthly': return 'info';
        case 'yearly': return 'danger';
        case 'daily': return 'success';
        default: return 'secondary';
    }
}
</script>

<template>
    <div>
        <Card class="shadow-md">
            <template #title>
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <div class="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-500">
                            <i class="pi pi-list text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold m-0 text-surface-900 dark:text-surface-0">{{ t('expenses.title') }}</h1>
                            <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">{{ t('expenses.subtitle') }}</p>
                        </div>
                    </div>
                    <Button :label="t('expenses.addNew')"  icon="pi pi-plus" @click="openNew" raised />
                </div>
            </template>
            <template #content>
                <DataTable 
                    :value="store.expenses" 
                    paginator 
                    :rows="10" 
                    tableStyle="min-width: 50rem"
                    sortField="date" 
                    :sortOrder="-1"
                >
                    <Column field="name" :header="t('expenses.name')" sortable>
                        <template #body="slotProps">
                            <div class="font-semibold text-surface-900 dark:text-surface-0">{{ slotProps.data.name }}</div>
                        </template>
                    </Column>
                    <Column field="amount" :header="t('expenses.amount')" sortable>
                        <template #body="slotProps">
                            <span class="font-bold text-lg" :class="{
                                'text-red-600 dark:text-red-400': slotProps.data.amount > 20000,
                                'text-amber-600 dark:text-amber-400': slotProps.data.amount <= 20000 && slotProps.data.amount > 5000,
                                'text-emerald-600 dark:text-emerald-400': slotProps.data.amount <= 5000
                            }">
                                {{ settings.currencySymbol }}{{ slotProps.data.amount.toLocaleString() }}
                            </span>
                        </template>
                    </Column>
                    <Column field="frequency" :header="t('expenses.frequency')" sortable>
                        <template #body="slotProps">
                            <Tag :value="t('frequency.' + slotProps.data.frequency)" :severity="getFrequencySeverity(slotProps.data.frequency)" class="uppercase font-semibold" />
                        </template>
                    </Column>
                    <Column field="date" :header="t('expenses.date')" sortable>
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-calendar text-surface-400"></i>
                                <span class="text-sm font-mono text-surface-600 dark:text-surface-300">{{ slotProps.data.date }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="category" :header="t('expenses.category')" sortable>
                        <template #body="slotProps">
                            <span class="inline-flex items-center px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-xs font-medium text-surface-700 dark:text-surface-300">
                                {{ slotProps.data.category }}
                            </span>
                        </template>
                    </Column>
                    <Column :header="t('expenses.actions')" :exportable="false" style="min-width: 8rem">
                        <template #body="slotProps">
                            <div class="flex gap-2">
                                <Button icon="pi pi-pencil" text rounded severity="secondary" @click="openEdit(slotProps.data)" />
                                <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteItem(slotProps.data)" />
                            </div>
                        </template>
                    </Column>
                    <template #empty>
                        <div class="text-center py-12">
                            <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
                            <p class="text-surface-500 dark:text-surface-400 text-lg">{{ t('expenses.noExpensesFound') }}</p>
                            <Button :label="t('expenses.addFirstExpense')" icon="pi pi-plus" class="mt-4" @click="openNew" />
                        </div>
                    </template>
                </DataTable>
            </template>
        </Card>

        <ExpenseForm 
            v-model:visible="formVisible" 
            :expenseToEdit="selectedExpense" 
            @saved="() => {}"
        />
        
        <ConfirmDialog />
    </div>
</template>

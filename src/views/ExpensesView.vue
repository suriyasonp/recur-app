<script setup lang="ts">
import { ref } from 'vue';
import { useExpenseStore } from '../stores/expense';
import type { Expense } from '../types/Expense';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import ExpenseForm from '../components/ExpenseForm.vue';

const store = useExpenseStore();
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
        message: 'Are you sure you want to delete ' + expense.name + '?',
        header: 'Confirm',
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
                            <h1 class="text-2xl font-bold m-0 text-surface-900 dark:text-surface-0">All Expenses</h1>
                            <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">Manage your recurring payments</p>
                        </div>
                    </div>
                    <Button label="New Expense" icon="pi pi-plus" @click="openNew" raised />
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
                    <Column field="name" header="Name" sortable>
                        <template #body="slotProps">
                            <div class="font-semibold text-surface-900 dark:text-surface-0">{{ slotProps.data.name }}</div>
                        </template>
                    </Column>
                    <Column field="amount" header="Amount" sortable>
                        <template #body="slotProps">
                            <span class="font-bold text-lg" :class="{
                                'text-red-600 dark:text-red-400': slotProps.data.amount > 20000,
                                'text-amber-600 dark:text-amber-400': slotProps.data.amount <= 20000 && slotProps.data.amount > 5000,
                                'text-emerald-600 dark:text-emerald-400': slotProps.data.amount <= 5000
                            }">
                                ฿{{ slotProps.data.amount.toLocaleString() }}
                            </span>
                        </template>
                    </Column>
                    <Column field="frequency" header="Frequency" sortable>
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.frequency" :severity="getFrequencySeverity(slotProps.data.frequency)" class="uppercase font-semibold" />
                        </template>
                    </Column>
                    <Column field="date" header="Date / Due" sortable>
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-calendar text-surface-400"></i>
                                <span class="text-sm font-mono text-surface-600 dark:text-surface-300">{{ slotProps.data.date }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="category" header="Category" sortable>
                        <template #body="slotProps">
                            <span class="inline-flex items-center px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-xs font-medium text-surface-700 dark:text-surface-300">
                                {{ slotProps.data.category }}
                            </span>
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width: 8rem">
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
                            <p class="text-surface-500 dark:text-surface-400 text-lg">No expenses found.</p>
                            <Button label="Add Your First Expense" icon="pi pi-plus" class="mt-4" @click="openNew" />
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

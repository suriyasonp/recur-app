<script setup lang="ts">
import { ref } from 'vue';
import { useExpenseStore } from '../stores/expense';
import { useSettingsStore } from '../stores/settings';
import Card from 'primevue/card';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Select from 'primevue/select';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';

const store = useExpenseStore();
const settings = useSettingsStore();
const toast = useToast();

const currencyOptions = ref([
    { label: 'Thai Baht (฿)', value: 'THB', symbol: '฿' },
    { label: 'US Dollar ($)', value: 'USD', symbol: '$' },
    { label: 'Euro (€)', value: 'EUR', symbol: '€' },
    { label: 'British Pound (£)', value: 'GBP', symbol: '£' },
    { label: 'Japanese Yen (¥)', value: 'JPY', symbol: '¥' },
    { label: 'Chinese Yuan (¥)', value: 'CNY', symbol: '¥' },
    { label: 'Indian Rupee (₹)', value: 'INR', symbol: '₹' },
    { label: 'Singapore Dollar (S$)', value: 'SGD', symbol: 'S$' },
]);

const selectedCurrency = ref(currencyOptions.value.find(c => c.value === settings.currency) || currencyOptions.value[0]);

function updateCurrency() {
    if (!selectedCurrency.value) return;
    
    settings.setCurrency(selectedCurrency.value.value, selectedCurrency.value.symbol);
    toast.add({ 
        severity: 'success', 
        summary: 'Updated', 
        detail: `Currency changed to ${selectedCurrency.value.label}`, 
        life: 3000 
    });
}

function exportData() {
    const data = store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recur-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.add({ severity: 'success', summary: 'Exported', detail: 'Data exported successfully', life: 3000 });
}

function importData(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
        try {
            store.importData(e.target.result);
             toast.add({ severity: 'success', summary: 'Imported', detail: 'Data imported successfully', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid JSON file', life: 3000 });
        }
    };
    reader.readAsText(file);
}
</script>

<template>
    <div class="max-w-4xl">
        <Card class="shadow-md mb-6">
            <template #title>
                <div class="flex items-center gap-3">
                    <div class="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-500">
                        <i class="pi pi-cog text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold m-0 text-surface-900 dark:text-surface-0">Settings</h1>
                        <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">Manage your preferences and data</p>
                    </div>
                </div>
            </template>
            <template #content>
                <div class="space-y-6">
                    <!-- Currency Settings -->
                    <div>
                        <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4 flex items-center gap-2">
                            <i class="pi pi-money-bill text-primary-500"></i>
                            Currency Settings
                        </h3>
                        
                        <div class="p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg">
                            <div class="flex items-start gap-3">
                                <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                                    <i class="pi pi-globe text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">Display Currency</h4>
                                    <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                        Choose the currency symbol to display throughout the app
                                    </p>
                                    <div class="flex gap-3 items-end">
                                        <div class="flex-1">
                                            <Select 
                                                v-model="selectedCurrency" 
                                                :options="currencyOptions" 
                                                optionLabel="label"
                                                placeholder="Select currency"
                                                class="w-full"
                                            />
                                        </div>
                                        <Button 
                                            label="Update" 
                                            icon="pi pi-check"
                                            @click="updateCurrency"
                                            outlined
                                        />
                                    </div>
                                    <p class="text-xs text-surface-500 mt-2">
                                        Current: {{ settings.currencySymbol }} ({{ settings.currency }})
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Data Management Section -->
                    <div>
                        <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4 flex items-center gap-2">
                            <i class="pi pi-database text-primary-500"></i>
                            Data Management
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Export Card -->
                            <div class="p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                                <div class="flex items-start gap-3">
                                    <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                                        <i class="pi pi-download text-xl"></i>
                                    </div>
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">Export Data</h4>
                                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                            Download all your expenses as a JSON file for backup or migration.
                                        </p>
                                        <Button 
                                            label="Export JSON" 
                                            icon="pi pi-download" 
                                            @click="exportData"
                                            outlined
                                            severity="success"
                                            class="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Import Card -->
                            <div class="p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                                <div class="flex items-start gap-3">
                                    <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                        <i class="pi pi-upload text-xl"></i>
                                    </div>
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">Import Data</h4>
                                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                            Restore your expenses from a previously exported JSON file.
                                        </p>
                                        <FileUpload 
                                            mode="basic" 
                                            accept="application/json"
                                            :maxFileSize="1000000"
                                            @select="importData"
                                            chooseLabel="Import JSON"
                                            chooseIcon="pi pi-upload"
                                            customUpload
                                            auto
                                            class="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Info Section -->
                    <div class="p-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-800 dark:border-primary-800 rounded-lg">
                        <div class="flex gap-3">
                            <i class="pi pi-info-circle text-primary-600 dark:text-primary-800 text-xl"></i>
                            <div class="flex-1">
                                <h4 class="font-semibold text-primary-900 dark:text-primary-800 mb-1">About Data Storage</h4>
                                <p class="text-sm text-primary-800 dark:text-primary-800">
                                    Your expense data is stored locally in your browser's localStorage. 
                                    Use the export feature regularly to create backups. 
                                    Clearing browser data will remove all expenses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <Toast />
    </div>
</template>

<style scoped>
.space-y-6 > * + * {
    margin-top: 1.5rem;
}
</style>

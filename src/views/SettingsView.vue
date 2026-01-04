<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useExpenseStore } from '../stores/expense';
import { useSettingsStore } from '../stores/settings';
import Card from 'primevue/card';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Select from 'primevue/select';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';

const { t, locale } = useI18n();
const store = useExpenseStore();
const settings = useSettingsStore();
const toast = useToast();

const languageOptions = ref([
    { label: 'English', value: 'en', flag: '🇬🇧' },
    { label: 'ไทย (Thai)', value: 'th', flag: '🇹🇭' },
    { label: 'Deutsch (German)', value: 'de', flag: '🇩🇪' },
    { label: '中文 (Chinese)', value: 'zh', flag: '🇨🇳' },
]);

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

const selectedLanguage = ref(languageOptions.value.find(l => l.value === settings.language) || languageOptions.value[0]);
const selectedCurrency = ref(currencyOptions.value.find(c => c.value === settings.currency) || currencyOptions.value[0]);

function updateLanguage() {
    if (!selectedLanguage.value) return;
    
    settings.setLanguage(selectedLanguage.value.value);
    locale.value = selectedLanguage.value.value;
    toast.add({ 
        severity: 'success', 
        summary: t('settings.languageUpdated'), 
        detail: selectedLanguage.value.label, 
        life: 3000 
    });
}

function updateCurrency() {
    if (!selectedCurrency.value) return;
    
    settings.setCurrency(selectedCurrency.value.value, selectedCurrency.value.symbol);
    toast.add({ 
        severity: 'success', 
        summary: t('settings.currencyUpdated'), 
        detail: selectedCurrency.value.label, 
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
    toast.add({ severity: 'success', summary: t('settings.exportSuccess'), detail: t('settings.exportSuccess'), life: 3000 });
}

function importData(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
        try {
            store.importData(e.target.result);
             toast.add({ severity: 'success', summary: t('settings.importSuccess'), detail: t('settings.importSuccess'), life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('settings.importError'), life: 3000 });
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
                        <h1 class="text-2xl font-bold m-0 text-surface-900 dark:text-surface-0">{{ t('settings.title') }}</h1>
                        <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">{{ t('settings.subtitle') }}</p>
                    </div>
                </div>
            </template>
            <template #content>
                <div class="space-y-6">
                    <!-- Language Settings -->
                    <div>
                        <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4 flex items-center gap-2">
                            <i class="pi pi-globe text-primary-500"></i>
                            {{ t('settings.languageSettings') }}
                        </h3>
                        
                        <div class="p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg">
                            <div class="flex items-start gap-3">
                                <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                    <i class="pi pi-language text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">{{ t('settings.displayLanguage') }}</h4>
                                    <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                        {{ t('settings.selectLanguage') }}
                                    </p>
                                    <div class="flex gap-3 items-end">
                                        <div class="flex-1">
                                            <Select 
                                                v-model="selectedLanguage" 
                                                :options="languageOptions" 
                                                optionLabel="label"
                                                placeholder="Select language"
                                                class="w-full"
                                            >
                                                <template #value="slotProps">
                                                    <div v-if="slotProps.value" class="flex items-center gap-2">
                                                        <span>{{ slotProps.value.flag }}</span>
                                                        <span>{{ slotProps.value.label }}</span>
                                                    </div>
                                                </template>
                                                <template #option="slotProps">
                                                    <div class="flex items-center gap-2">
                                                        <span>{{ slotProps.option.flag }}</span>
                                                        <span>{{ slotProps.option.label }}</span>
                                                    </div>
                                                </template>
                                            </Select>
                                        </div>
                                        <Button 
                                            :label="t('settings.updateLanguage')" 
                                            icon="pi pi-check"
                                            @click="updateLanguage"
                                            outlined
                                        />
                                    </div>
                                    <p class="text-xs text-surface-500 mt-2">
                                        {{ t('settings.currentLanguage') }}: {{ selectedLanguage?.label || 'English' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Currency Settings -->
                    <div>
                        <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4 flex items-center gap-2">
                            <i class="pi pi-money-bill text-primary-500"></i>
                            {{ t('settings.currencySettings') }}
                        </h3>
                        
                        <div class="p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg">
                            <div class="flex items-start gap-3">
                                <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                                    <i class="pi pi-dollar text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">{{ t('settings.displayCurrency') }}</h4>
                                    <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                        {{ t('settings.selectCurrency') }}
                                    </p>
                                    <div class="flex gap-3 items-end">
                                        <div class="flex-1">
                                            <Select 
                                                v-model="selectedCurrency" 
                                                :options="currencyOptions" 
                                                optionLabel="label"
                                                :placeholder="t('settings.selectCurrency')"
                                                class="w-full"
                                            />
                                        </div>
                                        <Button 
                                            :label="t('settings.updateCurrency')" 
                                            icon="pi pi-check"
                                            @click="updateCurrency"
                                            outlined
                                        />
                                    </div>
                                    <p class="text-xs text-surface-500 mt-2">
                                        {{ t('settings.currentCurrency') }}: {{ settings.currencySymbol }} ({{ settings.currency }})
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Data Management Section -->
                    <div>
                        <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4 flex items-center gap-2">
                            <i class="pi pi-database text-primary-500"></i>
                            {{ t('settings.dataManagement') }}
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Export Card -->
                            <div class="p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                                <div class="flex items-start gap-3">
                                    <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                                        <i class="pi pi-download text-xl"></i>
                                    </div>
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">{{ t('settings.exportData') }}</h4>
                                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                            {{ t('settings.exportDescription') }}
                                        </p>
                                        <Button 
                                            :label="t('settings.exportButton')" 
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
                                        <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">{{ t('settings.importData') }}</h4>
                                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                            {{ t('settings.importDescription') }}
                                        </p>
                                        <FileUpload 
                                            mode="basic" 
                                            accept="application/json"
                                            :maxFileSize="1000000"
                                            @select="importData"
                                            :chooseLabel="t('settings.importButton')"
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
                                <h4 class="font-semibold text-primary-900 dark:text-primary-800 mb-1">{{ t('settings.aboutStorage') }}</h4>
                                <p class="text-sm text-primary-800 dark:text-primary-800">
                                    {{ t('settings.storageInfo') }}
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

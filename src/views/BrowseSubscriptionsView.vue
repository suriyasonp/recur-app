<script setup lang="ts">
import { ref, computed } from 'vue';
import { subscriptionCatalog, type SubscriptionTemplate } from '../data/subscriptionCatalog';
import { useExpenseStore } from '../stores/expense';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const store = useExpenseStore();
const toast = useToast();

const searchQuery = ref('');
const selectedCategory = ref('All');
const showDialog = ref(false);
const selectedTemplate = ref<SubscriptionTemplate | null>(null);

// Form data
const formData = ref({
    name: '',
    amount: 0,
    frequency: 'monthly' as 'monthly' | 'yearly' | 'daily' | 'one-time',
    category: '',
    date: new Date().toISOString().split('T')[0]
});

const categories = computed(() => {
    const cats = new Set(subscriptionCatalog.map(s => s.category));
    return ['All', ...Array.from(cats)];
});

const filteredSubscriptions = computed(() => {
    let filtered = subscriptionCatalog;
    
    if (selectedCategory.value !== 'All') {
        filtered = filtered.filter(s => s.category === selectedCategory.value);
    }
    
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query) ||
            s.description?.toLowerCase().includes(query)
        );
    }
    
    return filtered;
});

const frequencyOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Daily', value: 'daily' },
    { label: 'One-Time', value: 'one-time' }
];

function openQuickAdd(template: SubscriptionTemplate) {
    selectedTemplate.value = template;
    formData.value = {
        name: template.name,
        amount: template.defaultAmount,
        frequency: template.defaultFrequency,
        category: template.category,
        date: new Date().toISOString().split('T')[0]
    };
    showDialog.value = true;
}

function saveSubscription() {
    if (!formData.value.name || !formData.value.amount) {
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Please fill in all required fields', 
            life: 3000 
        });
        return;
    }

    store.addExpense({
        name: formData.value.name,
        amount: formData.value.amount,
        frequency: formData.value.frequency,
        category: formData.value.category,
        date: (formData.value.date || new Date().toISOString().split('T')[0]) as string
    });

    toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `${formData.value.name} added successfully!`, 
        life: 3000 
    });

    showDialog.value = false;
    selectedTemplate.value = null;
}

const dateValue = computed({
    get: () => formData.value.date ? new Date(formData.value.date) : undefined,
    set: (val) => {
        if (val) {
            const d = new Date(val);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            formData.value.date = d.toISOString().split('T')[0];
        }
    }
});
</script>

<template>
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-2">
                Browse Subscriptions
            </h1>
            <p class="text-lg text-surface-600 dark:text-surface-400">
                Quick-add popular subscription services with pre-filled information
            </p>
        </div>

        <!-- Search and Filter -->
        <Card class="mb-6">
            <template #content>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-search" />
                            <InputText 
                                v-model="searchQuery" 
                                placeholder="Search subscriptions..." 
                                class="w-full"
                            />
                        </span>
                    </div>
                    <div class="w-full md:w-64">
                        <Select 
                            v-model="selectedCategory" 
                            :options="categories" 
                            placeholder="Filter by category"
                            class="w-full"
                        />
                    </div>
                </div>
            </template>
        </Card>

        <!-- Subscription Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card 
                v-for="subscription in filteredSubscriptions" 
                :key="subscription.id"
                class="text-center cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                @click="openQuickAdd(subscription)"
            >
                <template #content>
                    <div class="py-2">
                        <!-- Logo -->
                        <div class="text-5xl mb-3">
                            {{ subscription.logo }}
                        </div>
                        
                        <!-- Name -->
                        <h3 class="font-bold text-surface-900 dark:text-surface-0 mb-1 text-sm">
                            {{ subscription.name }}
                        </h3>
                        
                        <!-- Category -->
                        <p class="text-xs text-surface-500 dark:text-surface-400 mb-2">
                            {{ subscription.category }}
                        </p>
                        
                        <!-- Price -->
                        <div class="text-primary-600 font-semibold text-sm">
                            {{ subscription.currency === 'THB' ? '฿' : '$' }}{{ subscription.defaultAmount }}
                            <span class="text-xs text-surface-500">/{{ subscription.defaultFrequency === 'yearly' ? 'yr' : 'mo' }}</span>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Empty State -->
        <Card v-if="filteredSubscriptions.length === 0" class="mt-6">
            <template #content>
                <div class="text-center py-12">
                    <i class="pi pi-search text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
                    <p class="text-surface-500 dark:text-surface-400 text-lg mb-4">
                        No subscriptions found matching your search
                    </p>
                    <Button label="Clear Filters" @click="searchQuery = ''; selectedCategory = 'All'" />
                </div>
            </template>
        </Card>

        <!-- Quick Add Dialog -->
        <Dialog 
            v-model:visible="showDialog" 
            modal 
            :header="`Add ${selectedTemplate?.name}`"
            :style="{ width: '90vw', maxWidth: '500px' }"
        >
            <div class="flex flex-col gap-4 py-4" v-if="selectedTemplate">
                <!-- Logo and Info -->
                <div class="text-center pb-4 border-b border-surface-200 dark:border-surface-700">
                    <div class="text-6xl mb-2">{{ selectedTemplate.logo }}</div>
                    <p class="text-sm text-surface-500">{{ selectedTemplate.description }}</p>
                </div>

                <!-- Name -->
                <div class="flex flex-col gap-2">
                    <label for="name" class="font-semibold text-sm">Subscription Name</label>
                    <InputText id="name" v-model="formData.name" />
                </div>

                <!-- Amount -->
                <div class="flex flex-col gap-2">
                    <label for="amount" class="font-semibold text-sm">Amount</label>
                    <InputNumber 
                        id="amount" 
                        v-model="formData.amount" 
                        mode="currency" 
                        currency="THB" 
                        locale="th-TH"
                    />
                    <small class="text-surface-500">
                        Default: {{ selectedTemplate.currency === 'THB' ? '฿' : '$' }}{{ selectedTemplate.defaultAmount }}
                    </small>
                </div>

                <!-- Frequency -->
                <div class="flex flex-col gap-2">
                    <label for="frequency" class="font-semibold text-sm">Billing Period</label>
                    <Select 
                        id="frequency" 
                        v-model="formData.frequency" 
                        :options="frequencyOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        class="w-full"
                    />
                </div>

                <!-- Due Date -->
                <div class="flex flex-col gap-2">
                    <label for="date" class="font-semibold text-sm">Next Payment Date</label>
                    <DatePicker 
                        id="date" 
                        v-model="dateValue" 
                        dateFormat="yy-mm-dd" 
                        showIcon 
                        fluid
                    />
                </div>

                <!-- Category -->
                <div class="flex flex-col gap-2">
                    <label for="category" class="font-semibold text-sm">Category</label>
                    <InputText id="category" v-model="formData.category" />
                </div>

                <!-- Actions -->
                <div class="flex gap-2 pt-4">
                    <Button 
                        label="Cancel" 
                        severity="secondary" 
                        outlined 
                        class="flex-1"
                        @click="showDialog = false" 
                    />
                    <Button 
                        label="Add Subscription" 
                        icon="pi pi-check"
                        class="flex-1"
                        @click="saveSubscription" 
                    />
                </div>
            </div>
        </Dialog>

        <Toast />
    </div>
</template>

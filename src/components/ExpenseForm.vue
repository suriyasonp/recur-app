<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Expense } from '../types/Expense';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select'; 
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import { useExpenseStore } from '../stores/expense';

const props = defineProps<{
    visible: boolean;
    expenseToEdit?: Expense | null;
}>();

const emit = defineEmits(['update:visible', 'saved']);

const store = useExpenseStore();

const frequencies = ref([
    { label: 'One-Time', value: 'one-time' },
    { label: 'Daily', value: 'daily' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
]);

const form = ref<Partial<Expense>>({
    name: '',
    amount: 0,
    frequency: 'monthly',
    date: new Date().toISOString().split('T')[0],
    category: ''
});

const dateValue = computed({
    get: () => form.value.date ? new Date(form.value.date) : undefined,
    set: (val) => {
        if (val) {
             // Handle timezone offset issues by using local date string part manually or simple ISO slice if noon
             // Simple hack: set to noon to avoid day shift
             const d = new Date(val);
             d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
             form.value.date = d.toISOString().split('T')[0];
        } else {
            form.value.date = '';
        }
    }
});

// Watch for edit mode
watch(() => props.expenseToEdit, (newVal) => {
    if (newVal) {
        form.value = { ...newVal };
    } else {
        resetForm();
    }
}, { immediate: true });

function resetForm() {
    form.value = {
        name: '',
        amount: 0,
        frequency: 'monthly',
        date: new Date().toISOString().split('T')[0],
        category: ''
    };
}

function save() {
    if (!form.value.name || !form.value.amount) return;

    const expenseData = {
        ...form.value,
        id: props.expenseToEdit?.id // Keep ID if editing
    } as Expense;

    if (props.expenseToEdit) {
        store.updateExpense(expenseData);
    } else {
        store.addExpense(expenseData);
    }

    emit('saved');
    emit('update:visible', false);
    resetForm();
}
</script>

<template>
    <Dialog 
        :visible="visible" 
        @update:visible="emit('update:visible', $event)" 
        modal 
        header="Expense Details" 
        :style="{ width: '90vw', maxWidth: '500px' }"
    >
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="name">Name</label>
                <InputText id="name" v-model="form.name" autocomplete="off" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="amount">Amount</label>
                <InputNumber id="amount" v-model="form.amount" mode="currency" currency="THB" locale="th-TH" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="frequency">Frequency</label>
                <Select id="frequency" v-model="form.frequency" :options="frequencies" optionLabel="label" optionValue="value" placeholder="Select Frequency" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="date">Date / Start Date</label>
                 <DatePicker id="date" v-model="dateValue" dateFormat="yy-mm-dd" showIcon fluid />
            </div>


            <div class="flex flex-col gap-2">
                <label for="category">Category</label>
                <InputText id="category" v-model="form.category" />
            </div>
            
            <div class="flex justify-end gap-2 mt-4">
                <Button label="Cancel" text severity="secondary" @click="emit('update:visible', false)" />
                <Button label="Save" @click="save" />
            </div>
        </div>
    </Dialog>
</template>

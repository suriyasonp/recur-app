<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Expense } from '../types/Expense';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select'; 
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import { useExpenseStore } from '../stores/expense';
import { useSettingsStore } from '../stores/settings';

const props = defineProps<{
    visible: boolean;
    expenseToEdit?: Expense | null;
}>();

const emit = defineEmits(['update:visible', 'saved']);

const { t } = useI18n();
const store = useExpenseStore();
const settings = useSettingsStore();

const frequencies = computed(() => [
    { label: t('frequency.oneTime'), value: 'one-time' },
    { label: t('frequency.daily'), value: 'daily' },
    { label: t('frequency.monthly'), value: 'monthly' },
    { label: t('frequency.yearly'), value: 'yearly' }
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
        :header="props.expenseToEdit ? t('expenseForm.editExpense') : t('expenseForm.addExpense')" 
        :style="{ width: '90vw', maxWidth: '500px' }"
    >
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="name">{{ t('expenseForm.name') }}</label>
                <InputText id="name" v-model="form.name" autocomplete="off" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="amount">{{ t('expenseForm.amount') }}</label>
                <InputNumber id="amount" v-model="form.amount" mode="currency" :currency="settings.currency" :locale="settings.language === 'th' ? 'th-TH' : 'en-US'" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="frequency">{{ t('expenseForm.frequency') }}</label>
                <Select id="frequency" v-model="form.frequency" :options="frequencies" optionLabel="label" optionValue="value" :placeholder="t('expenseForm.selectFrequency')" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="date">{{ t('expenseForm.date') }}</label>
                 <DatePicker id="date" v-model="dateValue" dateFormat="yy-mm-dd" showIcon fluid />
            </div>


            <div class="flex flex-col gap-2">
                <label for="category">{{ t('expenseForm.category') }}</label>
                <InputText id="category" v-model="form.category" />
            </div>
            
            <div class="flex justify-end gap-2 mt-4">
                <Button :label="t('common.cancel')" text severity="secondary" @click="emit('update:visible', false)" />
                <Button :label="t('common.save')" @click="save" />
            </div>
        </div>
    </Dialog>
</template>

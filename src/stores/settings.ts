import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface AppSettings {
    currency: string;
    currencySymbol: string;
}

export const useSettingsStore = defineStore('settings', () => {
    // State
    const currency = ref<string>('THB');
    const currencySymbol = ref<string>('฿');

    // Persistence
    const loadFromStorage = () => {
        const stored = localStorage.getItem('recur_settings');
        if (stored) {
            const settings = JSON.parse(stored);
            currency.value = settings.currency || 'THB';
            currencySymbol.value = settings.currencySymbol || '฿';
        }
    };

    const saveToStorage = () => {
        localStorage.setItem('recur_settings', JSON.stringify({
            currency: currency.value,
            currencySymbol: currencySymbol.value
        }));
    };

    // Initialize
    loadFromStorage();
    watch([currency, currencySymbol], saveToStorage);

    // Actions
    function setCurrency(curr: string, symbol: string) {
        currency.value = curr;
        currencySymbol.value = symbol;
    }

    return {
        currency,
        currencySymbol,
        setCurrency
    };
});

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
    const language = ref<string>('en');

    // Persistence
    const loadFromStorage = () => {
        const stored = localStorage.getItem('recur_settings');
        if (stored) {
            const settings = JSON.parse(stored);
            currency.value = settings.currency || 'THB';
            currencySymbol.value = settings.currencySymbol || '฿';
            language.value = settings.language || 'en';
        }
    };

    const saveToStorage = () => {
        localStorage.setItem('recur_settings', JSON.stringify({
            currency: currency.value,
            currencySymbol: currencySymbol.value,
            language: language.value
        }));
    };

    // Initialize
    loadFromStorage();
    watch([currency, currencySymbol, language], saveToStorage);

    // Actions
    function setCurrency(curr: string, symbol: string) {
        currency.value = curr;
        currencySymbol.value = symbol;
    }

    function setLanguage(lang: string) {
        language.value = lang;
        localStorage.setItem('recur_language', lang);
    }

    return {
        currency,
        currencySymbol,
        language,
        setCurrency,
        setLanguage
    };
});

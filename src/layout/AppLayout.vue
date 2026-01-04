<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const items = ref([
    {
        label: () => t('nav.dashboard'),
        icon: 'pi pi-home',
        route: '/dashboard'
    },
    {
        label: () => t('nav.expenses'),
        icon: 'pi pi-list',
        route: '/expenses'
    },
    {
        label: () => t('nav.settings'),
        icon: 'pi pi-cog',
        route: '/settings' 
    }
]);
</script>

<template>
    <div class="min-h-screen" style="background: #ffffff;">
        <!-- Clean, minimal navigation -->
        <nav class="border-b border-surface-200 dark:border-surface-700 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/dashboard')">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                            <i class="pi pi-wallet text-white"></i>
                        </div>
                        <span class="text-xl font-bold text-surface-100 dark:text-surface-0">
                            Recur
                        </span>
                    </div>

                    <!-- Navigation Links -->
                    <div class="flex items-center gap-1">
                        <router-link 
                            v-for="item in items" 
                            :key="item.route"
                            :to="item.route"
                            v-slot="{ isActive }"
                            custom
                        >
                            <button
                                @click="router.push(item.route)"
                                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                :class="isActive 
                                    ? 'bg-primary-600 text-white' 
                                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'"
                            >
                                <i :class="item.icon" class="mr-2"></i>
                                {{ item.label() }}
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="py-8 px-4 sm:px-6 lg:px-8">
            <RouterView v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </RouterView>
        </main>

        <!-- Footer -->
        <footer class="border-t border-surface-200 dark:border-surface-700 mt-16 bg-white/50 dark:bg-surface-800/80 backdrop-blur-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="text-center text-sm text-surface-500 dark:text-surface-400">
                    <p class="mb-2">{{ t('footer.followUs') }}</p>
                    <p>{{ t('footer.madeWith') }}</p>
                    <p class="mt-2">
                        <a href="https://github.com/suriyasonp/recur-app" target="_blank" class="hover:text-primary-200 transition-colors">
                            <i class="pi pi-github mr-1"></i>
                            {{ t('footer.viewOnGitHub') }}
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

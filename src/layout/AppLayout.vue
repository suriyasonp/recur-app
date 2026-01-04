<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/dashboard'
    },
    {
        label: 'Expenses',
        icon: 'pi pi-list',
        route: '/expenses'
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog',
        route: '/settings' 
    }
]);
</script>

<template>
    <div class="min-h-screen">
        <!-- Clean, minimal navigation -->
        <nav class="border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/dashboard')">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <i class="pi pi-wallet text-white"></i>
                        </div>
                        <span class="text-xl font-bold text-surface-900 dark:text-surface-0">
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
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'"
                            >
                                <i :class="item.icon" class="mr-2"></i>
                                {{ item.label }}
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
        <footer class="border-t border-surface-200 dark:border-surface-700 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="text-center text-sm text-surface-500 dark:text-surface-400">
                    <p>Made with ❤️ using Vue 3 + PrimeVue + Tailwind CSS</p>
                    <p class="mt-2">
                        <a href="https://github.com/suriyasonp/recur-app" target="_blank" class="hover:text-primary-600 transition-colors">
                            <i class="pi pi-github mr-1"></i>
                            View on GitHub
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

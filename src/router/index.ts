import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layout/AppLayout.vue'
import Dashboard from '../components/Dashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect: '/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: Dashboard
                },
                {
                    path: '/expenses',
                    name: 'expenses',
                    component: () => import('../views/ExpensesView.vue') // Lazy load
                },
                {
                    path: '/browse',
                    name: 'browse',
                    component: () => import('../views/BrowseSubscriptionsView.vue')
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('../views/SettingsView.vue')
                }
            ]
        }
    ]
})

export default router

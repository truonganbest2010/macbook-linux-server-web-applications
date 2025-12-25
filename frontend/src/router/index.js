import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '../views/dashboard/DashboardView.vue';
import TodoAppView from '../views/dashboard/TodoAppView.vue';
import UrlAppView from '../views/dashboard/UrlAppView.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: DashboardView
    },
    {
        path: '/todos',
        name: 'todos',
        component: TodoAppView
    },
    {
        path: '/urls',
        name: 'urls',
        component: UrlAppView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
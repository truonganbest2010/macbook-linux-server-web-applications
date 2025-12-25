import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '../views/dashboard/DashboardView.vue';
import TodoAppView from '../views/todos/TodoAppView.vue';
import UrlAppView from '../views/urls/UrlAppView.vue';

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
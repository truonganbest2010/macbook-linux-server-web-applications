import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '../views/dashboard/DashboardView.vue';
import TodoAppView from '../views/todos/TodoAppView.vue';
import YtUrlAppView from '../views/yt-urls/YtUrlAppView.vue';

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
        path: '/yt-urls',
        name: 'ytUrls',
        component: YtUrlAppView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
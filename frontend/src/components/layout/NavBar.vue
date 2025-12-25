<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                Meatbird Server Applications
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link"
                        :class="{ active: $route.name === 'dashboard' }"
                        to="/"
                        >
                        Dashboard
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link"
                        :class="{ active: $route.name === 'todos' }"
                        to="/todos"
                        >
                        Todos
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link"
                        :class="{ active: $route.name === 'urls' }"
                        to="/urls"
                        >
                        URLs
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
// Navbar is mostly template-based;
</script>
import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import Accueil from "./Accueil.vue"
import Messages from "./Messages.vue"
import Profil from "./Profil.vue"
import Notifs from "./Notifs.vue"

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import "bootstrap-icons/font/bootstrap-icons.css"

// Définition des routes
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Accueil",
        component: Accueil
    },
    {
        path: "/messages",
        name: "Messages",
        component: Messages
    },
    {
        path: "/profil",
        name: "Profil",
        component: Profil
    },
    {
        path: "/notifs",
        name: "Notifs",
        component: Notifs
    }
];

// Création du router avec les routes définies ci-dessus
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router; // Pour pouvoir l'importer

// Création de l'application
createApp(App).use(router).mount("#app");
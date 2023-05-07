import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import Events from "./router/Events.vue"
import Messages from "./router/Messages.vue"
import Profil from "./router/Profile.vue"
import Notifs from "./router/Notifs.vue"

// Importation des méthodes pour créer le router
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Permet d'utiliser les icônes de Bootstrap
import "bootstrap-icons/font/bootstrap-icons.css"

// Définition des routes
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Accueil",
        component: Events
    },
    {
        path: "/messages",
        name: "Messages",
        component: Messages
    },
    {
        path: "/profile",
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
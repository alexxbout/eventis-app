import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import { routesGuard } from "./services/RouteGuard";

// Importation des méthodes pour créer le router
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Permet d'utiliser les icônes de Bootstrap
import "bootstrap-icons/font/bootstrap-icons.css"

// Définition des routes
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: () => import("./router/app/Home.vue"),
        meta: {
            requiresAuth: false,
            hideNavbar: true
        }
    },
    {
        path: "/register",
        name: "register",
        component: () => import("./router/registration/Register.vue"),
        meta: {
            requiresAuth: false,
            hideNavbar: true
        }
    },
    {
        path: "/events",
        name: "events",
        component: () => import("./router/app/events/Events.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: false
        }
    },
    {
        path: "/events/calendar",
        name: "eventsCalendar",
        component: () => import("./router/app/events/Events.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: false
        }
    },
    {
        path: "/events/:id",
        name: "eventDetail",
        component: () => import("./router/app/events/EventDetail.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/messages",
        name: "messages",
        component: () => import("./router/app/Messages.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/messages/:id",
        name: "messagesDetail",
        component: () => import("./router/app/MessagesDetails.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/profile/:id?",
        name: "profile",
        component: () => import("./router/app/Profile.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile/friends",
        name: "friends",
        component: () => import("./router/app/Friends.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/notifs",
        name: "notifs",
        component: () => import("./router/app/Notifs.vue"),
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/settings",
        name: "settings",
        component: () => import("./router/app/settings/Settings.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/settings/blocked",
        name: "settingsBlocked",
        component: () => import("./router/app/settings/SettingsBlocked.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/settings/infos",
        name: "settingsInfos",
        component: () => import("./router/app/settings/SettingsInfos.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/settings/interests",
        name: "settingsInterests",
        component: () => import("./router/app/settings/SettingsInterests.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/settings/password",
        name: "settingsPassword",
        component: () => import("./router/app/settings/SettingsPassword.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/admin",
        name: "admin",
        component: () => import("./router/admin/Admin.vue"),
        meta: {
            requiresAuth: true,
            hideNavbar: false
        }
    },
    {
        path: "/notfound",
        name: "notfound",
        component: () => import("./router/app/NotFound.vue"),
        meta: {
            requiresAuth: false,
            hideNavbar: true
        }
    }
];

// Création du router avec les routes définies ci-dessus
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Ajouter le garde de route pour les routes protégées
router.beforeEach(routesGuard);

// Définition des métadonnées des routes
declare module "vue-router" {
    interface RouteMeta {
        hideNavbar?: boolean
        requiresAuth: boolean
    }
}

// Création de l'application
createApp(App).use(router).mount("#app");
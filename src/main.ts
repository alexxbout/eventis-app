import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import { routesGuard } from "./services/RouteGuard";

import Home from "./router/app/Home.vue";
import Register from "./router/registration/Register.vue";
import Events from "./router/app/Events.vue";
import EventDetail from "./components/EventDetail.vue";
import Messages from "./router/app/Messages.vue";
import Profile from "./router/app/Profile.vue";
import Notifs from "./router/app/Notifs.vue";
import NotFound from "./router/app/NotFound.vue";

// Importation des méthodes pour créer le router
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Permet d'utiliser les icônes de Bootstrap
import "bootstrap-icons/font/bootstrap-icons.css"

// Définition des routes
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: Home,
        meta: {
            requiresAuth: false,
            hideNavbar: true
        }
    },
    {
        path: "/register",
        name: "register",
        component: Register,
        meta: {
            requiresAuth: false,
            hideNavbar: true
        }
    },
    {
        path: "/events",
        name: "events",
        component: Events,
        meta: {
            requiresAuth: true,
            hideNavbar: false
        }

    },
    {
        path: "/events/:id",
        name: "eventDetail",
        component: EventDetail,
        meta: {
            requiresAuth: true,
            hideNavbar: true
        }
    },
    {
        path: "/messages",
        name: "messages",
        component: Messages,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile/:id?",
        name: "profile",
        component: Profile,
        meta: {
            requiresAuth: true
        }
    },
    // {
    //     path: "/profile/:id",
    //     name: "profile",
    //     component: Profile,
    //     meta: {
    //         requiresAuth: true
    //     }
    // },
    {
        path: "/notifs",
        name: "notifs",
        component: Notifs,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/notfound",
        name: "notfound",
        component: NotFound,
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
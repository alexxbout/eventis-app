import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import { routesGuard } from "./services/RouteGuard";

import Home                from "./router/App/Home.vue"
import Register            from "./router/Registration/Register.vue"
import RegisterCredentials from "./router/Registration/RegisterCredentials.vue"
import RegisterCode        from "./router/Registration/RegisterCode.vue"
import RegisterPicture     from "./router/Registration/RegisterPicture.vue"
import RegisterFriends     from "./router/Registration/RegisterFriends.vue"
import RegisterInterests   from "./router/Registration/RegisterInterests.vue"
import RegisterCongrats    from "./router/Registration/RegisterCongrats.vue"
import Events              from "./router/App/Events.vue"
import EventDetail         from "./components/event/EventDetail.vue"
import Messages            from "./router/App/Messages.vue"
import Profil              from "./router/App/Profile.vue"
import Notifs              from "./router/App/Notifs.vue"

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
        // children: [
        //     {
        //         path: "code",
        //         name: "registerCode",
        //         component: RegisterCode,
        //         meta: {
        //             requiresAuth: false,
        //             hideNavbar: true
        //         }
        //     },
        //     {
        //         path: "credentials",
        //         name: "registerCredentials",
        //         component: RegisterCredentials,
        //         meta: {
        //             requiresAuth: false,
        //             hideNavbar: true
        //         },
        //         props: true
        //     },
        //     {
        //         path: "picture",
        //         name: "registerPicture",
        //         component: RegisterPicture,
        //         meta: {
        //             requiresAuth: true,
        //             hideNavbar: true
        //         }
        //     },
        //     {
        //         path: "friends",
        //         name: "registerFriends",
        //         component: RegisterFriends,
        //         meta: {
        //             requiresAuth: true,
        //             hideNavbar: true
        //         }
        //     },
        //     {
        //         path: "interests",
        //         name: "registerInterests",
        //         component: RegisterInterests,
        //         meta: {
        //             requiresAuth: true,
        //             hideNavbar: true
        //         }
        //     },
        //     {
        //         path: "congrats",
        //         name: "registerCongrats",
        //         component: RegisterCongrats,
        //         meta: {
        //             requiresAuth: true,
        //             hideNavbar: true
        //         }
        //     }
        // ]
    },
    {
        path: "/events",
        name: "events",
        component: Events,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/events/:id",
        name: "eventDetail",
        component: EventDetail,
        meta: {
            requiresAuth: true
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
        path: "/profile",
        name: "profile",
        component: Profil,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/notifs",
        name: "notifs",
        component: Notifs,
        meta: {
            requiresAuth: true
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
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import authService from "../utils/UtilsAuth";

export function routesGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    if (to.matched.length === 0) {
        next({ name: "notfound" });
    } else {
        const requiresAuth = to.meta.requiresAuth;

        if (requiresAuth) {
            // Vérifier si l'utilisateur est connecté
            if (authService.isLoggedIn()) {
                next();
            } else {
                // Rediriger vers la page de connexion
                next({ name: "home" });
            }
        } else {
            // La route n'a pas besoin d'authentification
            next();
        }
    }
}
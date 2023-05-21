import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import authService from "./AuthService";

export function routesGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
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
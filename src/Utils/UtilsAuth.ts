import axios, { AxiosResponse } from "axios";
import jwt_decode from "jwt-decode";
import type { IUser } from "../types/User";
import { HTTPCodes } from "./HTTPCodes";

class UtilsAuth {
    isLoggedIn(): boolean {
        return this.isValidToken();
    }

    isValidToken(): boolean {
        const token = this.getToken();

        if (!token) {
            return false;
        }

        const decodedToken: any = jwt_decode(token);
        if (!decodedToken || !decodedToken.exp) {
            return false;
        }

        const expirationDate = new Date(decodedToken.exp * 1000);
        const currentDate = new Date();
        return currentDate < expirationDate;
    }

    getToken(): string | null {
        try {
            const item = JSON.parse(localStorage.getItem("item") || "{}");
            return item.token;
        } catch (error) {
            console.error("Erreur lors de la récupération du token", error);
            return null;
        }
    }

    getAuthHeader(): object | null {
        const token = this.getToken();

        if (token) {
            return { Authorization: "Bearer " + token };
        } else {
            return null;
        }
    }

    getCurrentUser(): IUser | null {
        try {
            const item = JSON.parse(localStorage.getItem("item") || "{}");

            return item.user as IUser;
        }
        catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur", error);
            return null;
        }
    }

    async login(login: string, password: string): Promise<boolean> {
        let data = false;

        await axios.post(import.meta.env.VITE_API_URL + "api/auth/login", {
            login: login,
            password: password
        }).then((response) => {
            if (response.status == HTTPCodes.OK && response.data.data.token) {
                localStorage.setItem("item", JSON.stringify(response.data.data));
                data = true;
            }
        }).catch((error) => {
            console.error("Erreur lors de la connexion", error);
        });

        return data;
    }

    logout() {
        localStorage.removeItem("item");
    }
}

export default new UtilsAuth();
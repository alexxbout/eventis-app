import axios from "axios";
import jwt_decode from "jwt-decode";

const API_URL = "http://localhost:8080/api/";

class AuthService {
    isLoggedIn(): boolean {
        const userString = localStorage.getItem("user");        

        if (userString) {
            try {
                const user = JSON.parse(userString);

                return user.data.token && this.isValidToken();
            } catch (error) {
                console.error("Erreur lors de l'analyse des données de l'utilisateur", error);
                return false;
            }
        }

        return false;
    }

    isValidToken(): boolean {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user.data.token;

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

    login(login: string, password: string): Promise<any> {
        return axios
            .post(API_URL + "auth/login", {
                login: login,
                password: password
            })
            .then(response => {
                if (response.data.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    getAuthHeader(): object | null {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (user && user.token) {
            return { Authorization: "Bearer " + user.token };
        } else {
            return null;
        }
    }
}

export default new AuthService();
import axios from "axios";
import AuthService from "./AuthService";

/**
 * Service de gestion des appels à l'API
 */
class ApiService {

    baseUrl: string;
    authorizationHeader: any;

    constructor() {
        this.baseUrl = "http://localhost:8080/api/";
        // this.baseUrl = "http://192.168.1.98/istic-projet-api/public/api/";

        this.authorizationHeader = AuthService.getAuthHeader();
    }

    getCode(code: string) {
        return axios.get(this.baseUrl + "auth/code/" + code);
    }

    registerUser(code: string, firstname: string, lastname: string, password: string) {
        return axios.post(this.baseUrl + "auth/register", {
            code: code,
            firstname: firstname,
            lastname: lastname,
            password: password
        });
    }
}

export default new ApiService();
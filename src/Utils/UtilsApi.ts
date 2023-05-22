import axios from "axios";
import AuthService from "./UtilsAuth";

/**
 * Service de gestion des appels à l'API
 */
class UtilsApi {

    hostUrl: string;
    baseUrl: string;
    authorizationHeader: any;

    constructor() {
        this.hostUrl = "http://localhost:8080/";
        this.baseUrl = this.hostUrl + "api/";
        // this.baseUrl = "http://192.168.1.98/istic-projet-api/public/api/";

        this.authorizationHeader = AuthService.getAuthHeader();
    }

    // ############################################## CODE ##############################################
    getCode(code: string) {
        return axios.get(this.baseUrl + "auth/code/" + code);
    }

    // ############################################## USERS ##############################################
    registerUser(code: string, firstname: string, lastname: string, password: string) {
        return axios.post(this.baseUrl + "auth/register", {
            code: code,
            firstname: firstname,
            lastname: lastname,
            password: password
        });
    }

    updateUserPicture(id: number, picture: File) {
        return axios.post(this.baseUrl + "v1/user/image/" + id, picture, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        });
    }

    getUsersByFoyer(idFoyer: number) {
        return axios.get(this.baseUrl + "v1/user/foyer/" + idFoyer, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken()
            }
        });
    }

    askFriend(idUser: number, idFriend: number) {
        return axios.post(this.baseUrl + "v1/user/" + idUser + "/friend/ask/" + idFriend, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

}

export default new UtilsApi();
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

    getAllCode() {
        return axios.get(this.baseUrl + "auth/code/", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        });
    }

    getAllCodeByFoyer(idFoyer: number) {
        return axios.get(this.baseUrl + "auth/code/" + idFoyer, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        });
    }

    generateCode() {
        return axios.post(this.baseUrl + "v1/user/code/", null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    // ############################################## USERS ##############################################
    registerUser(code: string, firstname: string, lastname: string, password: string) {
        return axios.post(this.baseUrl + "auth/register", {
            code: code,
            "firstname": firstname,
            "lastname": lastname,
            "password": password
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

    getAllUsers() {
        return axios.get(this.baseUrl + "v1/user/", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    getUserById(idUser: number) {
        return axios.get(this.baseUrl + "v1/user/" + idUser, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    addUser(firstname: string, lastname: string, password: string, idFoyer: number, idRole: number) {
        return axios.post(this.baseUrl + "v1/user/", {
            "firstname": firstname,
            "lastname": lastname,
            "password": password,
            "idFoyer": idFoyer,
            "idRole": idRole
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    updateUser(idUser: number, firstname: string | null, lastname: string | null, pseudo: string | null) {
        return axios.put(this.baseUrl + "v1/user/" + idUser, {
            "firstname": firstname,
            "lastname": lastname,
            "pseudo": pseudo
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    deactivateUser(idUser: number) {
        return axios.put(this.baseUrl + "v1/user/deactivate" + idUser, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    reactivateUser(idUser: number) {
        return axios.put(this.baseUrl + "v1/user/reactivate" + idUser, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    updateUserPassword(idUser: number, oldpass: string, newpass: string) {
        return axios.put(this.baseUrl + "v1/user/password" + idUser, {
            "oldPassword": oldpass,
            "newPassword": newpass
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    getAffinities(idUser: number) {
        return axios.get(this.baseUrl + "v1/user/" + idUser + "/affinities", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    // ############################################## FRIEND ##############################################
    askFriend(idUser: number, idFriend: number) {
        return axios.post(this.baseUrl + "v1/user/" + idUser + "/friend/ask/" + idFriend, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    rejectFriendRequest(idUser: number, idFriend: number) {
        return axios.delete(this.baseUrl + "v1/user/" + idUser + "/friend/reject/" + idFriend, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    acceptFriendRequest(idUser1: number, idFriend: number) {
        return axios.post(this.baseUrl + "v1/user/" + idUser1 + "/friend/accept/" + idFriend, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    isPending(idUser1: number, idUser2: number) {
        return axios.post(this.baseUrl + "v1/user/" + idUser1 + "/friend/pending/" + idUser2, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    getAllFriends(idUser: number) {
        return axios.get(this.baseUrl + "v1/user/" + idUser + "/friend", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    isFriend(idUser1: number, idUser2: number) {
        return axios.get(this.baseUrl + "v1/user/" + idUser1 + "/friend/" + idUser2, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    removeFriendship(idUser1: number, idUser2: number) {
        return axios.delete(this.baseUrl + "v1/user/" + idUser1 + "/friend/" + idUser2, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    // ############################################## BLOCKED ##############################################
    // checkBloqued() --> pas faite dans l'api, a faire 

    checkBlocked(idUser: number, idUser2:number){
        return axios.get(this.baseUrl + "v1/user/blocked/" + idUser+"/"+idUser2, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }


    getAllUsersBlocked(idUser: number) {
        return axios.get(this.baseUrl + "v1/user/blocked/" + idUser, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    addBlockedUser(idUser: number, idBlocked: number) {
        return axios.post(this.baseUrl + "v1/user/blocked/" + idUser + "/" + idBlocked, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    removeBlockedUser(idUser: number, idBlocked: number) {
        return axios.delete(this.baseUrl + "v1/user/blocked/" + idUser + "/" + idBlocked, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    // ############################################## ROLE ##############################################

    getAllRole() {
        return axios.get(this.baseUrl + "v1/user/role/", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    // ############################################## FOYER ##############################################

    getAllFoyer() {
        return axios.get(this.baseUrl + "v1/foyer/", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    getAllFoyersByZip(zip: number) {
        return axios.get(this.baseUrl + "v1/foyer/zip/" + zip, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    getFoyerById(idFoyer: number){
        return axios.get(this.baseUrl + "v1/foyer/" + idFoyer, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    addFoyer(siret: number, city: string, zip: number, address: string) {

        return axios.post(this.baseUrl + "v1/foyer/", {
            "siret": siret,
            "zip": zip,
            "city": city,
            "address": address
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    // ############################################## EVENTS ##############################################

    getAllEvents() {
        return axios.get(this.baseUrl + "v1/event/", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    getEventsByZip(zip: number) {
        return axios.get(this.baseUrl + "v1/event/zip/" + zip, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    getEventById(idEvent: number) {
        return axios.get(this.baseUrl + "v1/event/" + idEvent, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * @description Update an event
     * @warning NO NULLABLE PARAMS INSTEAD OF description
     * @param idEvent => Id of the event
     * @param zip => Zip (2 num) of the event place
     * @param address => Adress of the event
     * @param city => City of the event
     * @param start => Time of the begening of the event 
     * @param category => Category of the event
     * @param description => LArge infos of the events
     * @method POST
     */
    addEvent(idFoyer: number, zip: number, address: string, city: string, start: Date, title: string, category: number, description: string | null) {
        return axios.post(this.baseUrl + "v1/event/", {
            "idFoyer": idFoyer,
            "zip": zip,
            "city": city,
            "address": address,
            "start": start,
            "title": title,
            "category": category,
            "description": description
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }
 
    /**
     * @description Update an event
     * @warning ALL NULLABLE PARAMS MUST BE NULL IF NO CHANGES TO APPLY 
     * @param idEvent => Id of the event
     * @param zip => Zip (2 num) of the event place
     * @param address => Adress of the event
     * @param city => City of the event
     * @param start => Time of the begening of the event 
     * @param category => Category of the event
     * @param description => LArge infos of the events
     * @method PUT
     */
    updateEvent(idEvent: number, zip: number, address: string, city: string, start: Date, title: string, category: number, description: string | null) {
        return axios.put(this.baseUrl + "v1/event/" + idEvent, {

        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * @description Pass the event to canceled
     * @param idEvent => id of the Event
     * @method PUT
     */
    cancelEvent(idEvent: number) {
        return axios.put(this.baseUrl + "v1/event/cancel/" + idEvent, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * @description Add an image to an event
     * @param idEvent => id of the Event
     * @param picture => Picture to add in the Event
     * @method POST
     */
    uncancelEvent(idEvent: number) {
        return axios.put(this.baseUrl + "v1/event/uncancel/" + idEvent, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * @description Add an image to an event
     * @param idEvent => id of the Event
     * @param picture => Picture to add in the Event
     * @method POST
     */
    imageEvent(idEvent: number, picture: File) {
        return axios.post(this.baseUrl + "v1/event/image/" + idEvent, picture, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        });
    }

    // ############################################## PARTICIANTS ##############################################
    
    /**
     * @description Get all the participants of an event
     * @param idEvent => id of the Event
     * @method GET
     */
    getAllParticipants(idEvent: number) {
        return axios.get(this.baseUrl + "v1/event/" + idEvent + "/participant", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * @description Add a user to an event
     * @param idEvent => id of the Event
     * @param idParticipant => id of the user to add
     * @method POST
     */
    addParticipant(idEvent: number, idParticipant: number) {
        return axios.post(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idParticipant, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * @description Remove a user from an event
     * @param idEvent => id of the Event
     * @param idParticipant => id of the user to remove
     * @method DELETE
     */
    removeParticipant(idEvent: number, idParticipant: number) {
        return axios.delete(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idParticipant, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * @description Check if user is participating
     * @param idUser1 => id of the current user
     * @param idEvent => id of the Event
     * @method POST
     */
    isParticipating(idUser1: number, idEvent: number) {
        return axios.get(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idUser1, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        });
    }
}

export default new UtilsApi();
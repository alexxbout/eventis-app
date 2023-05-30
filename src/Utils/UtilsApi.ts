import axios from "axios";
import AuthService from "./UtilsAuth";
import { IEvent } from "../types/Event";
import { IParticipant } from "../types/Participants";
import { HTTPCodes } from "./HTTPCodes";
import { ICode } from "../types/Code";
import { IFoyer } from "../types/Foyer";
import { IUser } from "../types/User";
import { INotification } from "../types/Notification";

/**
 * Service de gestion des appels à l'API
 */
class UtilsApi {

    hostUrl: string;
    baseUrl: string;
    authorizationHeader: any;

    constructor() {
        this.hostUrl = import.meta.env.VITE_API_URL;
        this.baseUrl = this.hostUrl + "api/";

        this.authorizationHeader = AuthService.getAuthHeader();
    }

    // ############################################## IMAGES ##############################################

    getImage(ressource: string, file: string): string {
        return this.hostUrl + "image/" + ressource + "/" + file;
    }

    // ############################################## CODE ##############################################

    async getCode(code: string): Promise<ICode | null> {
        let data = null;

        await axios.get(this.baseUrl + "auth/code/" + code)
            .then((response) => {
                if (response.status === HTTPCodes.OK) {
                    data = response.data.data as ICode;
                }
            }).catch((error) => {
                console.log(error, "Error while getting code");
            });

        return data;
    }

    async getAllCode(): Promise<ICode[] | null> {
        let data = null;

        await axios.get(this.baseUrl + "auth/code/", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as ICode[];
            }
        }).catch((error) => {
            console.log(error, "Error while getting all code");
        });

        return data;
    }

    async getAllCodeByFoyer(idFoyer: number): Promise<ICode[] | null> {
        let data = null;

        await axios.get(this.baseUrl + "auth/code/" + idFoyer, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as ICode[];
            }
        }).catch((error) => {
            console.log(error, "Error while getting all code by foyer");
        });

        return data;
    }

    async generateCode(): Promise<string | null> {
        let data = null;

        await axios.post(this.baseUrl + "v1/user/code/", null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.code as string;
            }
        }).catch((error) => {
            console.log(error, "Error while generating code");

        });

        return data;
    }

    // ############################################## USERS ##############################################

    async registerUser(code: string, firstname: string, lastname: string, password: string): Promise<string | null> {
        let data = null;

        await axios.post(this.baseUrl + "auth/register", {
            code: code,
            "firstname": firstname,
            "lastname": lastname,
            "password": password
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.login as string;
            }
        }).catch((error) => {
            console.log(error, "Error while registering user");
        });

        return data;
    }

    async updateUserPicture(id: number, picture: FormData): Promise<string | null> {
        let data = null;

        await axios.post(this.baseUrl + "v1/user/image/" + id, picture, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.file as string;
            }
        }).catch((error) => {
            console.log(error, "Error while updating user picture");
        });

        return data;
    }

    async removeUserPicture(id: number): Promise<boolean> {
        let data = false;

        await axios.delete(this.baseUrl + "v1/user/image/" + id, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status === HTTPCodes.OK;
        }).catch((error) => {
            console.log(error, "Error while removing user picture");
        });

        return data;
    }

    // getUsersByFoyer(idFoyer: number) {
    //     return axios.get(this.baseUrl + "v1/user/foyer/" + idFoyer, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken()
    //         }
    //     });
    // }

    // getAllUsers() {
    //     return axios.get(this.baseUrl + "v1/user/", {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    async getUserById(idUser: number | string): Promise<IUser | null> {
        let data: IUser | null = null;

        await axios.get(this.baseUrl + "v1/user/" + idUser, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as IUser;
            }
        }).catch((error) => {
            console.log(error, "Error while getting user by id");
        });

        return data;
    }

    // addUser(firstname: string, lastname: string, password: string, idFoyer: number, idRole: number) {
    //     return axios.post(this.baseUrl + "v1/user/", {
    //         "firstname": firstname,
    //         "lastname": lastname,
    //         "password": password,
    //         "idFoyer": idFoyer,
    //         "idRole": idRole
    //     }, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // updateUser(idUser: number, firstname: string | null, lastname: string | null, pseudo: string | null) {
    //     return axios.put(this.baseUrl + "v1/user/" + idUser, {
    //         "firstname": firstname,
    //         "lastname": lastname,
    //         "pseudo": pseudo
    //     }, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // deactivateUser(idUser: number) {
    //     return axios.put(this.baseUrl + "v1/user/deactivate" + idUser, null, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // reactivateUser(idUser: number) {
    //     return axios.put(this.baseUrl + "v1/user/reactivate" + idUser, null, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // updateUserPassword(idUser: number, oldpass: string, newpass: string) {
    //     return axios.put(this.baseUrl + "v1/user/password" + idUser, {
    //         "oldPassword": oldpass,
    //         "newPassword": newpass
    //     }, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    async getAffinities(idUser: number): Promise<IUser[] | null> {
        let data: IUser[] | null = null;

        await axios.get(this.baseUrl + "v1/user/" + idUser + "/affinities", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as IUser[];
            }
        }).catch((error) => {
            console.log(error, "Error while getting affinities");
        });

        return data as IUser[] | null;
    }

    // ############################################## FRIEND ##############################################

    async askFriend(idUser: number, idFriend: number): Promise<boolean> {
        let data = false;

        await axios.post(this.baseUrl + "v1/user/" + idUser + "/friend/ask/" + idFriend, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status === HTTPCodes.CREATED;
        }).catch((error) => {
            console.log(error, "Error while asking friend");
        });

        return data;
    }

    async rejectFriendRequest(idUser: number, idFriend: number): Promise<boolean> {
        let data = false;

        await axios.delete(this.baseUrl + "v1/user/" + idUser + "/friend/reject/" + idFriend, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status === HTTPCodes.OK;
        }).catch((error) => {
            console.log(error, "Error while rejecting friend");
        });

        return data;
    }

    async acceptFriendRequest(idUser1: number, idFriend: number): Promise<boolean> {
        let data = false;

        await axios.post(this.baseUrl + "v1/user/" + idUser1 + "/friend/accept/" + idFriend, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status === HTTPCodes.CREATED;
        }).catch((error) => {
            console.log(error, "Error while accepting friend");
        });

        return data;
    }

    async isPending(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        await axios.get(this.baseUrl + "v1/user/" + idUser1 + "/friend/pending/" + idUser2, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.pending as boolean;
            }
        }).catch((error) => {
            console.log(error, "Error while checking if friend request is pending");
        });

        return data;
    }

    async getAllFriends(idUser: number): Promise<{ idUser1: number, idUser2: number, since: string }[]> {
        let data: { idUser1: number, idUser2: number, since: string }[] = [];

        await axios.get(this.baseUrl + "v1/user/" + idUser + "/friend", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as { idUser1: number, idUser2: number, since: string }[];
            }
        }).catch((error) => {
            console.log(error, "Error while getting all friends");
        });

        return data;
    }

    async isFriend(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        await axios.get(this.baseUrl + "v1/user/" + idUser1 + "/friend/" + idUser2, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.friend as boolean;
            }
        }).catch((error) => {
            console.log(error, "Error while checking if friend");
        });

        return data;
    }

    async removeFriendship(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        await axios.delete(this.baseUrl + "v1/user/" + idUser1 + "/friend/" + idUser2, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status === HTTPCodes.OK;
        }).catch((error) => {
            console.log(error, "Error while removing friendship");
        });

        return data;
    }

    // ############################################## BLOCKED ##############################################

    // checkBlocked(idUser: number, idUser2: number) {
    //     return axios.get(this.baseUrl + "v1/user/blocked/" + idUser + "/" + idUser2, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }


    // getAllUsersBlocked(idUser: number) {
    //     return axios.get(this.baseUrl + "v1/user/blocked/" + idUser, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // addBlockedUser(idUser: number, idBlocked: number) {
    //     return axios.post(this.baseUrl + "v1/user/blocked/" + idUser + "/" + idBlocked, null, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // removeBlockedUser(idUser: number, idBlocked: number) {
    //     return axios.delete(this.baseUrl + "v1/user/blocked/" + idUser + "/" + idBlocked, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // ############################################## ROLE ##############################################

    // getAllRole() {
    //     return axios.get(this.baseUrl + "v1/user/role/", {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // ############################################## FOYER ##############################################

    // getAllFoyer() {
    //     return axios.get(this.baseUrl + "v1/foyer/", {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // getAllFoyersByZip(zip: number) {
    //     return axios.get(this.baseUrl + "v1/foyer/zip/" + zip, {
    //         headers: {
    //             "Authorization": "Bearer " + AuthService.getToken(),
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    async getFoyerById(idFoyer: number): Promise<IFoyer | null> {
        let data: IFoyer | null = null;

        await axios.get(this.baseUrl + "v1/foyer/" + idFoyer, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.data.data as IFoyer;
        }).catch((error) => {
            console.error(error, "Error while getting foyer by id");
        });

        return data;
    }

    async addFoyer(siret: number, city: string, zip: number, address: string): Promise<boolean> {
        let data = false;

        await axios.post(this.baseUrl + "v1/foyer/", {
            "siret": siret,
            "zip": zip,
            "city": city,
            "address": address
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status == HTTPCodes.CREATED;
        }).catch((error) => {
            console.error(error, "Error while adding a foyer");
        });

        return data;
    }

    // ############################################## EVENTS ##############################################

    async getAllEvents(): Promise<IEvent[] | null> {
        let data = null;

        await axios.get(this.baseUrl + "v1/event/", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent[];
            }
        }).catch((error) => {
            console.error(error, "Error while getting all events");
        });

        return data;
    }

    async getEventsByZip(zip: number): Promise<IEvent[] | null> {
        let data = null;

        await axios.get(this.baseUrl + "v1/event/zip/" + zip, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent[];
            }
        }).catch((error) => {
            console.error(error, "Error while getting events by zip");
        });

        return data;
    }

    async getEventById(idEvent: number): Promise<IEvent | null> {
        let data = null;

        await axios.get(this.baseUrl + "v1/event/" + idEvent, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent;
            }
        }).catch((error) => {
            console.error(error, "Error while getting event by id");
        });

        return data;
    }

    async addEvent(idFoyer: number, zip: number, address: string, city: string, start: Date, title: string, idCategorie: number, description: string | null): Promise<boolean> {
        let data = false;

        await axios.post(this.baseUrl + "v1/event/", {
            "idFoyer": idFoyer,
            "zip": zip,
            "city": city,
            "address": address,
            "start": start,
            "title": title,
            "idCategorie": idCategorie,
            "description": description
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status == HTTPCodes.CREATED;
        }).catch((error) => {
            console.error(error, "Error while adding event");
        });

        return data;
    }

    async updateEvent(event: IEvent): Promise<boolean> {
        let data = false;

        await axios.put(this.baseUrl + "v1/event/" + event.id, {
            ...event
        }, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status == HTTPCodes.OK;
        }).catch((error) => {
            console.error(error, "Error while updating event");
        });

        return data;
    }

    async cancelEvent(idEvent: number): Promise<boolean> {
        let data = false;

        await axios.put(this.baseUrl + "v1/event/cancel/" + idEvent, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status == HTTPCodes.OK;
        }).catch((error) => {
            console.error(error, "Error while canceling event");
        });

        return data;
    }

    async uncancelEvent(idEvent: number): Promise<boolean> {
        let data = false;

        await axios.put(this.baseUrl + "v1/event/uncancel/" + idEvent, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.status == HTTPCodes.OK;
        }).catch((error) => {
            console.error(error, "Error while uncanceling event");
        });

        return data;
    }

    async addEventImage(idEvent: number, picture: File): Promise<string | null> {
        let data = null;

        await axios.post(this.baseUrl + "v1/event/image/" + idEvent, picture, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data.file as string;
            }
        }).catch((error) => {
            console.error(error, "Error while adding image to event");
        });

        return data;
    }

    // ############################################## PARTICIANTS ##############################################

    async getAllParticipants(idEvent: number): Promise<IParticipant[] | null> {
        let data = null;

        await axios.get(this.baseUrl + "v1/event/" + idEvent + "/participant", {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            data = response.data.data as IParticipant[];

            if (response.status == HTTPCodes.OK) {
                response.data.data as IParticipant[]
            } else if (response.status == HTTPCodes.NO_CONTENT) {
                data = [];
            } else {
                data = null;
            }
        }).catch((error) => {
            console.error(error, "Error while getting participants of event");
        });

        return data;
    }

    async addParticipant(idEvent: number, idUser: number): Promise<number> {
        let data = -1;

        await axios.post(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idUser, null, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.CREATED) {
                data = response.data.data.nbParticipants as number;
            }
        }).catch((error) => {
            console.error(error, "Error while adding participant to event");
        });

        return data;
    }

    async removeParticipant(idEvent: number, idUser: number): Promise<number> {
        let data = -1;

        await axios.delete(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idUser, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data.nbParticipants as number;
            }
        }).catch((error) => {
            console.error(error, "Error while removing participant of event");
        });

        return data;
    }

    async isParticipating(idEvent: number, idUser: number): Promise<boolean> {
        let data = false;

        await axios.get(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idUser, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data.status as boolean;
            }
        }).catch((error) => {
            console.error(error, "Error while getting participants of event");
        });

        return data;
    }

    // ############################################## NOTIFICATIONS ##############################################

    async getNotifications(idUser: number): Promise<INotification | null> {
        let data = null;

        await axios.get(this.baseUrl + "v1/notifications/" + idUser, {
            headers: {
                "Authorization": "Bearer " + AuthService.getToken(),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as INotification;
            }
        }).catch((error) => {
            console.error(error, "Error while getting notifications");
        });

        return data;
    }
}

export default new UtilsApi();
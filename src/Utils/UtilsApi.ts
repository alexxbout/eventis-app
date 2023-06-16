import axios from "axios";
import AuthService from "./UtilsAuth";

import type { IEvent, IParticipant, ICode, IFoyer, INotification, IInterest, IUser, IBlocked, IPending } from "../types/interfaces";
import { HTTPCodes } from "./HTTPCodes";

const removeNullValues = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}

/**
 * Service de gestion des appels à l'API
 */
class UtilsApi {

    hostUrl: string;
    baseUrl: string;
    authorizationHeader: any;

    errorLevel: number;

    constructor() {
        this.hostUrl = import.meta.env.VITE_API_URL;
        this.baseUrl = this.hostUrl + "api/";

        this.authorizationHeader = AuthService.getAuthHeader();

        this.errorLevel = import.meta.env.VITE_ERROR_LEVEL;
    }

    async performRequest(name: string, method: string, url: string, data: any, actionCallBack: (response: any) => void, errorCallback?: (response: any) => void, authHeaders: boolean = true, customHeaders?: any) {
        if (this.errorLevel > 0) console.log("DEBUG : API - " + name);

        const headers: { [key: string]: string; } = {
            "Content-Type": "application/json"
        };

        if (authHeaders) {
            headers["Authorization"] = "Bearer " + AuthService.getToken();
        }

        if (customHeaders) {
            for (const key in customHeaders) {
                headers[key] = customHeaders[key];
            }
        }

        await axios.request({
            method: method,
            url: this.baseUrl + url,
            data: data,
            headers: headers
        }).then((response) => {
            if (this.errorLevel > 0) console.log(response);

            actionCallBack(response);
        }).catch((error) => {
            if (this.errorLevel > 0) {
                console.log(error);
                console.log("DEBUG : " + error.response?.data?.message);

                if (error.response?.data?.errors) {
                    for (const key in error.response.data.errors) {
                        console.log("DEBUG : " + key + " - " + error.response.data.errors[key]);
                    }
                }
            }

            if (errorCallback) {
                errorCallback(error);
            }
        }).finally(() => {
            if (this.errorLevel > 0) console.log("DEBUG : API - " + name + " - END");
        });
    }

    // ############################################## IMAGES ##############################################

    getImage(ressource: string, file: string): string {
        return this.hostUrl + "image/" + ressource + "/" + file;
    }

    // ############################################## CODE ##############################################

    async getCode(code: string): Promise<boolean> {
        let data = false;

        await this.performRequest("getCode", "GET", "auth/code/" + code, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

    async getAllCode(): Promise<ICode[] | null> {
        let data = null;

        await this.performRequest("getAllCode", "GET", "auth/code/", null, (response) => {
            data = response.data.data as ICode[];
        });


        return data;
    }

    async getAllCodeByFoyer(idFoyer: number): Promise<ICode[] | null> {
        let data = null;

        await this.performRequest("getAllCodeByFoyer", "GET", "auth/code/" + idFoyer, null, (response) => {
            data = response.data.data as ICode[];
        });

        return data;
    }

    async generateCode(): Promise<string | null> {
        let data = null;

        await this.performRequest("generateCode", "POST", "v1/user/code/", null, (response) => {
            data = response.data.data.code as string;
        });

        return data;
    }

    // ############################################## USERS ##############################################

    async registerUser(code: string, firstname: string, lastname: string, password: string): Promise<string | null> {
        let data = null;

        await this.performRequest("registerUser", "POST", "auth/register", {
            code: code,
            "firstname": firstname,
            "lastname": lastname,
            "password": password
        }, (response) => {
            data = response.data.data.login as string;
        });

        return data;
    }

    async updateUserPicture(id: number, picture: FormData): Promise<string | null> {
        let data = null;

        await this.performRequest(
            "updateUserPicture",
            "POST",
            "v1/user/image/" + id, picture,
            (response) => {
                data = response.data.data.file as string;
            },
            undefined,
            true,
            {
                "Content-Type": "multipart/form-data"
            });

        return data;
    }

    async removeUserPicture(id: number): Promise<boolean> {
        let data = false;

        await this.performRequest("removeUserPicture", "DELETE", "v1/user/image/" + id, null, (response) => {
            data = response.status === HTTPCodes.OK;
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

    async getUsersByFoyer(idFoyer: number): Promise<IUser[] | null> {
        let data: IUser[] | null = null;

        await this.performRequest("getUsersByFoyer", "GET", "v1/user/foyer/" + idFoyer, null, (response) => {
            data = response.data.data as IUser[];
        });

        return data;
    }

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

        await this.performRequest("getUserById", "GET", "v1/user/" + idUser, null, (response) => {
            data = response.data.data as IUser;
        });

        return data;
    }

    async updateUser(idUser: number, firstname?: string, lastname?: string, emoji?: string | null, pseudo?: string, showPseudo?: string, bio?: string): Promise<{ success: boolean, error?: string }> {
        let data: { success: boolean, error?: string } = { success: false };

        const body = {
            "firstname": firstname,
            "lastname": lastname,
            "emoji": emoji,
            "pseudo": pseudo,
            "showPseudo": showPseudo,
            "bio": bio
        };

        await this.performRequest("updateUser", "PUT", "v1/user/" + idUser, removeNullValues(body), (response) => {
            data.success = response.status === HTTPCodes.OK;
        }, (error) => {
            data.success = false;
            data.error = error.response.data.message;
        });

        return data;
    }

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

    async updateUserPassword(idUser: number, oldpass: string, newpass: string): Promise<{ status: boolean; error: string }> {
        const data: { status: boolean; error: string } = { status: false, error: "" };

        await this.performRequest(
            "updateUserPassword",
            "PUT",
            "v1/user/password/" + idUser,
            {
                "id": idUser,
                "oldPassword": oldpass,
                "newPassword": newpass
            },
            (response) => {
                data.status = response.status === HTTPCodes.OK;
            },
            (error) => {
                data.error = error.response?.data?.message;
            });

        return data;
    }

    async getAffinities(idUser: number): Promise<IUser[] | null> {
        let data: IUser[] | null = null;

        await this.performRequest("getAffinities", "GET", "v1/user/" + idUser + "/affinities", null, (response) => {
            data = response.data.data as IUser[];
        });

        return data as IUser[] | null;
    }

    // ############################################## INTEREST ##############################################

    async getAllInterests(): Promise<IInterest[]> {
        let data: IInterest[] = [];

        await this.performRequest("getAllInterests", "GET", "v1/interest", null, (response) => {
            data = response.data.data as IInterest[];
        });

        return data;
    }

    async getUserInterests(idUser: number | string): Promise<IInterest[]> {
        let data: IInterest[] = [];

        await this.performRequest("getUserInterests", "GET", "v1/user/" + idUser + "/interest", null, (response) => {
            data = response.data.data as IInterest[];
        });

        return data;
    }

    async addUserInterest(idUser: number, idInterest: number): Promise<boolean> {
        let data = false;

        await this.performRequest("addUserInterest", "POST", "v1/user/" + idUser + "/interest/" + idInterest, null, (response) => {
            data = response.status === HTTPCodes.CREATED;
        });

        return data;
    }

    async deleteUserInterest(idUser: number, idInterest: number): Promise<boolean> {
        let data = false;

        await this.performRequest("deleteUserInterest", "DELETE", "v1/user/" + idUser + "/interest/" + idInterest, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

    // ############################################## FRIEND ##############################################

    async askFriend(idUser: number, idFriend: number): Promise<boolean> {
        let data = false;

        await this.performRequest("askFriend", "POST", "v1/user/" + idUser + "/friend/ask/" + idFriend, null, (response) => {
            data = response.status === HTTPCodes.CREATED;
        });

        return data;
    }

    async rejectFriendRequest(idUser: number, idFriend: number): Promise<boolean> {
        let data = false;

        await this.performRequest("rejectFriendRequest", "DELETE", "v1/user/" + idUser + "/friend/reject/" + idFriend, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

    async acceptFriendRequest(idRequester: number, idRequested: number): Promise<boolean> {
        let data = false;

        await this.performRequest("acceptFriendRequest", "POST", "v1/user/" + idRequester + "/friend/accept/" + idRequested, null, (response) => {
            data = response.status === HTTPCodes.CREATED;
        });

        return data;
    }

    async isPending(idRequester: number, idRequested: number): Promise<IPending> {
        let data: IPending = {
            pending: false,
            value: null
        };

        await this.performRequest("isPending", "GET", "v1/user/" + idRequester + "/friend/pending/" + idRequested, null, (response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as IPending;
            }
        });

        return data;
    }

    async getAllFriends(idUser: number): Promise<IUser[]> {
        let data: IUser[] = [];

        await this.performRequest("getAllFriends", "GET", "v1/user/" + idUser + "/friend", null, (response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as IUser[];
            }
        });

        return data;
    }

    async isFriend(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        await this.performRequest("isFriend", "GET", "v1/user/" + idUser1 + "/friend/" + idUser2, null, (response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.friend as boolean;
            }
        });

        return data;
    }

    async removeFriendship(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        await this.performRequest("removeFriendship", "DELETE", "v1/user/" + idUser1 + "/friend/" + idUser2, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

    // ############################################## BLOCKED ##############################################

    async isBlocked(idUser: number, idUser2: number): Promise<boolean> {
        let data = false;

        await this.performRequest("isBlocked", "GET", "v1/user/blocked/" + idUser + "/" + idUser2, null, (response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.blocked as boolean;
            }
        });

        return data;
    }

    async getAllBlocked(idUser: number): Promise<IBlocked[]> {
        let data: IBlocked[] = [];

        await this.performRequest("getAllUsersBlocked", "GET", "v1/user/blocked/" + idUser, null, (response) => {
            data = response.status === HTTPCodes.OK ? response.data.data as IBlocked[] : [];
        });

        return data;
    }

    async addBlockedUser(idUser: number, idBlocked: number): Promise<boolean> {
        let data = false;

        await this.performRequest("addBlockedUser", "POST", "v1/user/blocked/" + idUser + "/" + idBlocked, null, (response) => {
            data = response.status === HTTPCodes.CREATED;
        });

        return data;
    }

    async removeBlockedUser(idUser: number, idBlocked: number): Promise<boolean> {
        let data = false;

        await this.performRequest("removeBlockedUser", "DELETE", "v1/user/blocked/" + idUser + "/" + idBlocked, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

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

        await this.performRequest("getFoyerById", "GET", "v1/foyer/" + idFoyer, null, (response) => {
            data = response.data.data as IFoyer;
        });

        return data;
    }

    async addFoyer(siret: number, city: string, zip: number, address: string): Promise<boolean> {
        let data = false;

        await this.performRequest("addFoyer", "POST", "v1/foyer/", {
            "siret": siret,
            "zip": zip,
            "city": city,
            "address": address
        }, (response) => {
            data = response.status == HTTPCodes.CREATED;
        });

        return data;
    }

    // ############################################## EVENTS ##############################################

    async getAllEvents(): Promise<IEvent[] | null> {
        let data = null;

        await this.performRequest("getAllEvents", "GET", "v1/event/", null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent[];
            }
        });

        return data;
    }

    async getEventsByZip(zip: number): Promise<IEvent[] | null> {
        let data = null;

        await this.performRequest("getEventsByZip", "GET", "v1/event/zip/" + zip, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent[];
            }
        });

        return data;
    }


    /**
     * @param date Pass date from GMT time to get the events
     * @param zip 
     */
    async getEventsByDateAndZip(date: number, zip: number): Promise<IEvent[] | null> {
        let data: IEvent[] | null = null;

        await this.performRequest("getEventsByDateAndZip", "GET", "v1/event/cal/" + date + "/" + zip, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent[];
            }
        });

        return data;
    }

    async getEventsForTime(timelapse: number): Promise<string[]> {
        let data: string[] = [];

        await this.performRequest("getEventsForTime", "GET", "v1/event/cal/" + timelapse, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as string[];
            }
        });

        return data;
    }

    async getEventById(idEvent: number): Promise<IEvent | null> {
        let data = null;

        await this.performRequest("getEventById", "GET", "v1/event/" + idEvent, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent;
            }
        });

        return data;
    }

    async addEvent(idFoyer: number, zip: number, address: string, city: string, start: Date, title: string, idCategorie: number, description: string | null): Promise<boolean> {
        let data = false;

        await this.performRequest("addEvent", "POST", "v1/event/", {
            "idFoyer": idFoyer,
            "zip": zip,
            "city": city,
            "address": address,
            "start": start,
            "title": title,
            "idCategorie": idCategorie,
            "description": description
        }, (response) => {
            data = response.status == HTTPCodes.CREATED;
        });

        return data;
    }

    async updateEvent(event: IEvent): Promise<boolean> {
        let data = false;

        await this.performRequest("updateEvent", "PUT", "v1/event/" + event.id, {
            ...event
        }, (response) => {
            data = response.status == HTTPCodes.OK;
        });

        return data;
    }

    async cancelEvent(idEvent: number): Promise<boolean> {
        let data = false;

        await this.performRequest("cancelEvent", "PUT", "v1/event/cancel/" + idEvent, null, (response) => {
            data = response.status == HTTPCodes.OK;
        });

        return data;
    }

    async uncancelEvent(idEvent: number): Promise<boolean> {
        let data = false;

        await this.performRequest("uncancelEvent", "PUT", "v1/event/uncancel/" + idEvent, null, (response) => {
            data = response.status == HTTPCodes.OK;
        });

        return data;
    }

    async addEventImage(idEvent: number, picture: File): Promise<string | null> {
        let data = null;

        await this.performRequest("addEventImage", "POST", "v1/event/image/" + idEvent, picture, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data.file as string;
            }
        });

        return data;
    }

    // ############################################## PARTICIANTS ##############################################

    async getAllParticipants(idEvent: number): Promise<IParticipant[] | null> {
        let data = null;

        await this.performRequest("getAllParticipants", "GET", "v1/event/" + idEvent + "/participant", null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IParticipant[];
            } else if (response.status == HTTPCodes.NO_CONTENT) {
                data = [];
            } else {
                data = null;
            }
        });

        return data;
    }

    async addParticipant(idEvent: number, idUser: number): Promise<number> {
        let data = -1;

        await this.performRequest("addParticipant", "POST", "v1/event/" + idEvent + "/participant/" + idUser, null, (response) => {
            if (response.status == HTTPCodes.CREATED) {
                data = response.data.data.nbParticipants as number;
            }
        });

        return data;
    }

    async removeParticipant(idEvent: number, idUser: number): Promise<number> {
        let data = -1;

        await this.performRequest("removeParticipant", "DELETE", "v1/event/" + idEvent + "/participant/" + idUser, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data.nbParticipants as number;
            }
        });

        return data;
    }

    async isParticipating(idEvent: number, idUser: number): Promise<boolean> {
        let data = false;

        await this.performRequest("isParticipating", "GET", "v1/event/" + idEvent + "/participant/" + idUser, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data.status as boolean;
            }
        });

        return data;
    }

    // ############################################## NOTIFICATIONS ##############################################

    async getNotifications(idUser: number): Promise<INotification | null> {
        let data = null;

        await this.performRequest("getNotifications", "GET", "v1/notifications/" + idUser, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as INotification;
            }
        });

        return data;
    }


    // ############################################## SEARCH ##############################################

    async search(value: string): Promise<IUser[] | null> {
        let data = null;

        await this.performRequest("search", "GET", "v1/search/" + value, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IUser[];
            }
        });

        return data;
    }

    // ############################################## EMOJIS ##############################################

    async getEmojis(): Promise<string[]> {
        let data: string[] = [];

        await this.performRequest("getEmojis", "GET", "v1/emoji", null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as string[];
            }
        });

        return data;
    }
}
export default new UtilsApi();
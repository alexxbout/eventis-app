import axios from "axios";
import AuthService from "./UtilsAuth";

import type { IEvent, IParticipant, ICode, IFoyer, INotification, IInterest, IUser } from "../types/interfaces";
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

    async performRequest(name: string, method: string, url: string, data: any, actionCallBack: (response: any) => void, errorCallback?: (response: any) => void, authHeaders: boolean = true, extraHeaders?: any) {
        if (this.errorLevel > 0) console.log("DEBUG : API - " + name);

        const headers: { [key: string]: string; } = {
            "Content-Type": "application/json"
        };

        if (authHeaders) {
            headers["Authorization"] = "Bearer " + AuthService.getToken();
        }

        if (extraHeaders) {
            for (const key in extraHeaders) {
                headers[key] = extraHeaders[key];
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

        // await axios.get(this.baseUrl + "auth/code/" + code)
        //     .then((response) => {
        //         data = response.status === HTTPCodes.OK;
        //     }).catch((error) => {
        //         console.log(error, "Error while getting code");
        //     });

        // return data;

        await this.performRequest("getCode", "GET", "auth/code/" + code, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

    async getAllCode(): Promise<ICode[] | null> {
        let data = null;

        // await axios.get(this.baseUrl + "auth/code/", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "multipart/form-data"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as ICode[];
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting all code");
        // });

        await this.performRequest("getAllCode", "GET", "auth/code/", null, (response) => {
            data = response.data.data as ICode[];
        });


        return data;
    }

    async getAllCodeByFoyer(idFoyer: number): Promise<ICode[] | null> {
        let data = null;

        // await axios.get(this.baseUrl + "auth/code/" + idFoyer, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "multipart/form-data"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as ICode[];
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting all code by foyer");
        // });

        await this.performRequest("getAllCodeByFoyer", "GET", "auth/code/" + idFoyer, null, (response) => {
            data = response.data.data as ICode[];
        });

        return data;
    }

    async generateCode(): Promise<string | null> {
        let data = null;

        // await axios.post(this.baseUrl + "v1/user/code/", null, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data.code as string;
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while generating code");

        // });

        await this.performRequest("generateCode", "POST", "v1/user/code/", null, (response) => {
            data = response.data.data.code as string;
        });

        return data;
    }

    // ############################################## USERS ##############################################

    async registerUser(code: string, firstname: string, lastname: string, password: string): Promise<string | null> {
        let data = null;

        // await axios.post(this.baseUrl + "auth/register", {
        //     code: code,
        //     "firstname": firstname,
        //     "lastname": lastname,
        //     "password": password
        // }).then((response) => {
        //     if (response.status === HTTPCodes.CREATED) {
        //         data = response.data.data.login as string;
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while registering user");
        // });

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

        // await axios.post(this.baseUrl + "v1/user/image/" + id, picture, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "multipart/form-data"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data.file as string;
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while updating user picture");
        // });

        await this.performRequest("updateUserPicture", "POST", "v1/user/image/" + id, picture, (response) => {
            data = response.data.data.file as string;
        });

        return data;
    }

    async removeUserPicture(id: number): Promise<boolean> {
        let data = false;

        // await axios.delete(this.baseUrl + "v1/user/image/" + id, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.OK;
        // }).catch((error) => {
        //     console.log(error, "Error while removing user picture");
        // });

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

        // await axios.get(this.baseUrl + "v1/user/foyer/" + idFoyer, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as IUser[];
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting users by foyer");
        // });

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

        // await axios.get(this.baseUrl + "v1/user/" + idUser, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as IUser;
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting user by id");
        // });

        await this.performRequest("getUserById", "GET", "v1/user/" + idUser, null, (response) => {
            data = response.data.data as IUser;
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

    async updateUser(idUser: number, firstname?: string, lastname?: string, emoji?: string | null, pseudo?: string, showPseudo?: string, bio?: string): Promise<boolean> {
        let data = false;

        // build an object with only the not null values
        const body = {
            "firstname": firstname,
            "lastname": lastname,
            "emoji": emoji,
            "pseudo": pseudo,
            "showPseudo": showPseudo,
            "bio": bio
        };

        // await axios.put(this.baseUrl + "v1/user/" + idUser, removeNullValues(body), {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.OK;
        // }).catch((error) => {
        //     console.log(error, "Error while updating user");
        // });

        await this.performRequest("updateUser", "PUT", "v1/user/" + idUser, removeNullValues(body), (response) => {
            data = response.status === HTTPCodes.OK;
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

        // await axios.get(this.baseUrl + "v1/user/" + idUser + "/affinities", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as IUser[];
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting affinities");
        // });

        await this.performRequest("getAffinities", "GET", "v1/user/" + idUser + "/affinities", null, (response) => {
            data = response.data.data as IUser[];
        });

        return data as IUser[] | null;
    }

    // ############################################## INTEREST ##############################################

    async getAllInterests(): Promise<IInterest[]> {
        let data: IInterest[] = [];

        // await axios.get(this.baseUrl + "v1/interest", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as IInterest[];
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting all interests");
        // });

        await this.performRequest("getAllInterests", "GET", "v1/interest", null, (response) => {
            data = response.data.data as IInterest[];
        });

        return data;
    }

    async getUserInterests(idUser: number | string): Promise<IInterest[]> {
        let data: IInterest[] | null = [];

        // await axios.get(this.baseUrl + "v1/user/" + idUser + "/interest", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as IInterest[];
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting user iterests");
        // });

        await this.performRequest("getUserInterests", "GET", "v1/user/" + idUser + "/interest", null, (response) => {
            data = response.data.data as IInterest[];
        });

        return data;
    }

    async addUserInterest(idUser: number, idInterest: number): Promise<boolean> {
        let data = false;

        // await axios.post(this.baseUrl + "v1/user/" + idUser + "/interest/" + idInterest, null, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.CREATED;
        // }).catch((error) => {
        //     console.log(error, "Error while adding user interest");
        // });

        await this.performRequest("addUserInterest", "POST", "v1/user/" + idUser + "/interest/" + idInterest, null, (response) => {
            data = response.status === HTTPCodes.CREATED;
        });

        return data;
    }

    async deleteUserInterest(idUser: number, idInterest: number): Promise<boolean> {
        let data = false;

        // await axios.delete(this.baseUrl + "v1/user/" + idUser + "/interest/" + idInterest, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.OK;
        // }).catch((error) => {
        //     console.log(error, "Error while deleting user interest");
        // });

        await this.performRequest("deleteUserInterest", "DELETE", "v1/user/" + idUser + "/interest/" + idInterest, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

    // ############################################## FRIEND ##############################################

    async askFriend(idUser: number, idFriend: number): Promise<boolean> {
        let data = false;

        // await axios.post(this.baseUrl + "v1/user/" + idUser + "/friend/ask/" + idFriend, null, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.CREATED;
        // }).catch((error) => {
        //     console.log(error, "Error while asking friend");
        // });

        await this.performRequest("askFriend", "POST", "v1/user/" + idUser + "/friend/ask/" + idFriend, null, (response) => {
            data = response.status === HTTPCodes.CREATED;
        });

        return data;
    }

    async rejectFriendRequest(idUser: number, idFriend: number): Promise<boolean> {
        let data = false;

        // await axios.delete(this.baseUrl + "v1/user/" + idUser + "/friend/reject/" + idFriend, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.OK;
        // }).catch((error) => {
        //     console.log(error, "Error while rejecting friend");
        // });

        await this.performRequest("rejectFriendRequest", "DELETE", "v1/user/" + idUser + "/friend/reject/" + idFriend, null, (response) => {
            data = response.status === HTTPCodes.OK;
        });

        return data;
    }

    async acceptFriendRequest(idUser1: number, idFriend: number): Promise<boolean> {
        let data = false;

        // await axios.post(this.baseUrl + "v1/user/" + idUser1 + "/friend/accept/" + idFriend, null, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.CREATED;
        // }).catch((error) => {
        //     console.log(error, "Error while accepting friend");
        // });

        await this.performRequest("acceptFriendRequest", "POST", "v1/user/" + idUser1 + "/friend/accept/" + idFriend, null, (response) => {
            data = response.status === HTTPCodes.CREATED;
        });

        return data;
    }

    async isPending(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        // await axios.get(this.baseUrl + "v1/user/" + idUser1 + "/friend/pending/" + idUser2, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data.pending as boolean;
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while checking if friend request is pending");
        // });

        await this.performRequest("isPending", "GET", "v1/user/" + idUser1 + "/friend/pending/" + idUser2, null, (response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.pending as boolean;
            }
        });

        return data;
    }

    async getAllFriends(idUser: number): Promise<IUser[]> {
        let data: IUser[] = [];

        // await axios.get(this.baseUrl + "v1/user/" + idUser + "/friend", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data as IUser[];
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while getting all friends");
        // });

        await this.performRequest("getAllFriends", "GET", "v1/user/" + idUser + "/friend", null, (response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data as IUser[];
            }
        });

        return data;
    }

    async isFriend(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        // await axios.get(this.baseUrl + "v1/user/" + idUser1 + "/friend/" + idUser2, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status === HTTPCodes.OK) {
        //         data = response.data.data.friend as boolean;
        //     }
        // }).catch((error) => {
        //     console.log(error, "Error while checking if friend");
        // });

        await this.performRequest("isFriend", "GET", "v1/user/" + idUser1 + "/friend/" + idUser2, null, (response) => {
            if (response.status === HTTPCodes.OK) {
                data = response.data.data.friend as boolean;
            }
        });

        return data;
    }

    async removeFriendship(idUser1: number, idUser2: number): Promise<boolean> {
        let data = false;

        // await axios.delete(this.baseUrl + "v1/user/" + idUser1 + "/friend/" + idUser2, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status === HTTPCodes.OK;
        // }).catch((error) => {
        //     console.log(error, "Error while removing friendship");
        // });

        await this.performRequest("removeFriendship", "DELETE", "v1/user/" + idUser1 + "/friend/" + idUser2, null, (response) => {
            data = response.status === HTTPCodes.OK;
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

        // await axios.get(this.baseUrl + "v1/foyer/" + idFoyer, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.data.data as IFoyer;
        // }).catch((error) => {
        //     console.error(error, "Error while getting foyer by id");
        // });

        await this.performRequest("getFoyerById", "GET", "v1/foyer/" + idFoyer, null, (response) => {
            data = response.data.data as IFoyer;
        });

        return data;
    }

    async addFoyer(siret: number, city: string, zip: number, address: string): Promise<boolean> {
        let data = false;

        // await axios.post(this.baseUrl + "v1/foyer/", {
        //     "siret": siret,
        //     "zip": zip,
        //     "city": city,
        //     "address": address
        // }, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status == HTTPCodes.CREATED;
        // }).catch((error) => {
        //     console.error(error, "Error while adding a foyer");
        // });

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

        // await axios.get(this.baseUrl + "v1/event/", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as IEvent[];
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting all events");
        // });

        await this.performRequest("getAllEvents", "GET", "v1/event/", null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent[];
            }
        });

        return data;
    }

    async getEventsByZip(zip: number): Promise<IEvent[] | null> {
        let data = null;

        // await axios.get(this.baseUrl + "v1/event/zip/" + zip, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as IEvent[];
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting events by zip");
        // });

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

        // await axios.get(this.baseUrl + "v1/event/cal/" + date + "/" + zip, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as IEvent[];
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting events by zip and date");
        // });

        await this.performRequest("getEventsByDateAndZip", "GET", "v1/event/cal/" + date + "/" + zip, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent[];
            }
        });

        return data;
    }

    async getEventsForTime(timelapse: number): Promise<string[]> {
        let data: string[] = [];

        // await axios.get(this.baseUrl + "v1/event/cal/" + timelapse, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as string[];
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting dates of the events");
        // });

        await this.performRequest("getEventsForTime", "GET", "v1/event/cal/" + timelapse, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as string[];
            }
        });

        return data;
    }

    async getEventById(idEvent: number): Promise<IEvent | null> {
        let data = null;

        // await axios.get(this.baseUrl + "v1/event/" + idEvent, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as IEvent;
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting event by id");
        // });

        await this.performRequest("getEventById", "GET", "v1/event/" + idEvent, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as IEvent;
            }
        });

        return data;
    }

    async addEvent(idFoyer: number, zip: number, address: string, city: string, start: Date, title: string, idCategorie: number, description: string | null): Promise<boolean> {
        let data = false;

        // await axios.post(this.baseUrl + "v1/event/", {
        //     "idFoyer": idFoyer,
        //     "zip": zip,
        //     "city": city,
        //     "address": address,
        //     "start": start,
        //     "title": title,
        //     "idCategorie": idCategorie,
        //     "description": description
        // }, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status == HTTPCodes.CREATED;
        // }).catch((error) => {
        //     console.error(error, "Error while adding event");
        // });

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

        // await axios.put(this.baseUrl + "v1/event/" + event.id, {
        //     ...event
        // }, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status == HTTPCodes.OK;
        // }).catch((error) => {
        //     console.error(error, "Error while updating event");
        // });

        await this.performRequest("updateEvent", "PUT", "v1/event/" + event.id, {
            ...event
        }, (response) => {
            data = response.status == HTTPCodes.OK;
        });

        return data;
    }

    async cancelEvent(idEvent: number): Promise<boolean> {
        let data = false;

        // await axios.put(this.baseUrl + "v1/event/cancel/" + idEvent, null, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status == HTTPCodes.OK;
        // }).catch((error) => {
        //     console.error(error, "Error while canceling event");
        // });

        await this.performRequest("cancelEvent", "PUT", "v1/event/cancel/" + idEvent, null, (response) => {
            data = response.status == HTTPCodes.OK;
        });

        return data;
    }

    async uncancelEvent(idEvent: number): Promise<boolean> {
        let data = false;

        // await axios.put(this.baseUrl + "v1/event/uncancel/" + idEvent, null, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.status == HTTPCodes.OK;
        // }).catch((error) => {
        //     console.error(error, "Error while uncanceling event");
        // });

        await this.performRequest("uncancelEvent", "PUT", "v1/event/uncancel/" + idEvent, null, (response) => {
            data = response.status == HTTPCodes.OK;
        });

        return data;
    }

    async addEventImage(idEvent: number, picture: File): Promise<string | null> {
        let data = null;

        // await axios.post(this.baseUrl + "v1/event/image/" + idEvent, picture, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "multipart/form-data"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data.file as string;
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while adding image to event");
        // });

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

        // await axios.get(this.baseUrl + "v1/event/" + idEvent + "/participant", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     data = response.data.data as IParticipant[];

        //     if (response.status == HTTPCodes.OK) {
        //         response.data.data as IParticipant[]
        //     } else if (response.status == HTTPCodes.NO_CONTENT) {
        //         data = [];
        //     } else {
        //         data = null;
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting participants of event");
        // });

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

        // await axios.post(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idUser, null, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.CREATED) {
        //         data = response.data.data.nbParticipants as number;
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while adding participant to event");
        // });

        await this.performRequest("addParticipant", "POST", "v1/event/" + idEvent + "/participant/" + idUser, null, (response) => {
            if (response.status == HTTPCodes.CREATED) {
                data = response.data.data.nbParticipants as number;
            }
        });

        return data;
    }

    async removeParticipant(idEvent: number, idUser: number): Promise<number> {
        let data = -1;

        // await axios.delete(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idUser, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data.nbParticipants as number;
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while removing participant of event");
        // });

        await this.performRequest("removeParticipant", "DELETE", "v1/event/" + idEvent + "/participant/" + idUser, null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data.nbParticipants as number;
            }
        });

        return data;
    }

    async isParticipating(idEvent: number, idUser: number): Promise<boolean> {
        let data = false;

        // await axios.get(this.baseUrl + "v1/event/" + idEvent + "/participant/" + idUser, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data.status as boolean;
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting participants of event");
        // });

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

        // await axios.get(this.baseUrl + "v1/notifications/" + idUser, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as INotification;
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting notifications");
        // });

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

        // await axios.get(this.baseUrl + "v1/search/" + value, {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as IUser[];
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while searching");
        // });

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

        // await axios.get(this.baseUrl + "v1/emoji", {
        //     headers: {
        //         "Authorization": "Bearer " + AuthService.getToken(),
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     if (response.status == HTTPCodes.OK) {
        //         data = response.data.data as string[];
        //     }
        // }).catch((error) => {
        //     console.error(error, "Error while getting emojis");
        // });

        await this.performRequest("getEmojis", "GET", "v1/emoji", null, (response) => {
            if (response.status == HTTPCodes.OK) {
                data = response.data.data as string[];  
            }
        });

        return data;
    }
}
export default new UtilsApi();
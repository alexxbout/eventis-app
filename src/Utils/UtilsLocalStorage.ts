import { IUser } from "../types/interfaces";

class UtilsLocalStorage {
    updateUser(user: IUser): void {
        const item = JSON.parse(localStorage.getItem("app") || "{}");
        item.user = user;
        localStorage.setItem("app", JSON.stringify(item));
    }
}

export default new UtilsLocalStorage();
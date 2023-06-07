import { ButtonHTMLAttributes } from "vue";

export interface IButton {
    apparence: {
        type         : "PRIMARY" | "SECONDARY";
        color        : "BLUE" | "GREEN" | "RED" | "WHITE" | "GRAY";
        size         : "BASE" | "XS";
        rounded?     : "BASE" | "FULL";
        custom?: {
            height: string;
            padding: string;
        }
    };
    icon?: {
        side: "LEFT" | "RIGHT";
        name: "ARROW_LEFT" | "ARROW_RIGHT" | "USERS" | "LOCATION"
    };
    type?: ButtonHTMLAttributes["type"];
    text?: any;
    disabled?: boolean;
};

export const ICONS: {[key: string]: string} = {
    ARROW_LEFT : "bi-arrow-left-short",
    ARROW_RIGHT: "bi-arrow-right-short",
    USERS      : "bi-people-fill",
    LOCATION   : "bi-geo-alt-fill"
};

export const getIconByName = (name: string): string => {
    return ICONS[name];
}
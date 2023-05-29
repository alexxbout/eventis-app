export interface IButton {
    text: any;
    type: "PRIMARY" | "SECONDARY";
    color: "BLUE" | "GREEN" | "RED" | "WHITE" | "GRAY";
    size: "BASE" | "XS";

    borderRadius?: "BASE" | "FULL";
}

export interface IButtonIcon {
    side: "LEFT" | "RIGHT";
    name: string;
}

// const for icons
export const ICONS = {
    ARROW_LEFT: "bi bi-arrow-left-short",
    ARROW_RIGHT: "bi bi-arrow-right-short",
    USERS: "bi bi-people-fill",
    LOCATION: "bi bi-geo-alt-fill"
};
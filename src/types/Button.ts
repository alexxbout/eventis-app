export interface IButton {
    text: any;
    type: "PRIMARY" | "SECONDARY";
    color: "BLUE" | "GREEN" | "RED" | "WHITE" | "GRAY";
    size: "BASE" | "XS";

    borderRadius?: "BASE" | "FULL";
}
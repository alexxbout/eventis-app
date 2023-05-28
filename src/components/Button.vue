<template>
    <button ref="el" @click="handleClick" :style="style" class="text-[14px] flex items-center justify-center font-semibold text-center text-white disabled:bg-gray-600">
        {{ buttonProps.text }}
    </button>
</template>
  
<script setup lang="ts">
import type { IButton } from "../types/Button";
import { PropType, StyleValue, computed, onMounted, ref } from "vue";

const props = defineProps({
    data: {
        type: Object as PropType<IButton>,
        default: <IButton>{
            text        : "",
            size        : "BASE",
            type        : "PRIMARY",
            color       : "GRAY",
            borderRadius: "BASE"
        },
    },
    isLoading: {
        type: Boolean,
        default: false
    },
});

const COLORS = {
    BLUE       : "#166CF7",
    GREEN      : "#69AF31",
    RED        : "#D0454A",
    GRAY       : "#A2A2A2",
    WHITE      : "#FFF",
    TRANSPARENT: "transparent",
};

const isLoading = ref<boolean>(props.isLoading);

// Save the props in a reactive variable to update the component when the props change
const buttonProps = ref<IButton>(props.data);

const el = ref<HTMLButtonElement | null>(null);

// Create a computed variable to get the style of the button when the props change
const style = computed<StyleValue>(() => {
    const sizeStyle = getSizeStyle(buttonProps.value.size);
    const borderRadiusStyle = getBorderRadiusStyle(buttonProps.value.size, buttonProps.value.borderRadius);
    const colorStyle = getColorStyle(buttonProps.value.type, buttonProps.value.color);

    return Object.assign({}, sizeStyle, borderRadiusStyle, colorStyle);
});

// ############################################## Functions ##############################################
const getSizeStyle = (size: "BASE" | "XS") => {
    return size == "XS" ? { "padding": "8px 17px" } : { "padding": "13px 20px" };
};

const getBorderRadiusStyle = (size: "BASE" | "XS", borderRadius?: "BASE" | "FULL"): StyleValue => {
    if (size == "XS") {
        return { "border-radius": "9999px" };
    } else {
        return borderRadius == "FULL" ? { "border-radius": "100%" } : { "border-radius": "14px" };
    }
};

const getColorStyle = (type: "PRIMARY" | "SECONDARY", color: "BLUE" | "GREEN" | "RED" | "WHITE" | "GRAY") => {
    if (isLoading.value && el.value) {
        el.value.classList.add("loading");
        return;
    }

    if (type === "SECONDARY") {
        switch (color) {
            case "RED":
                return { "background-color": COLORS.TRANSPARENT, "border-color": COLORS.RED, color: COLORS.RED, "border-width": "2px" };
            case "GRAY":
                return { "background-color": COLORS.TRANSPARENT, "border-color": COLORS.GRAY, color: COLORS.GRAY, "border-width": "2px" };
            case "BLUE":
            default:
                return { "background-color": COLORS.TRANSPARENT, "border-color": COLORS.BLUE, color: COLORS.BLUE, "border-width": "2px" };
        }
    }

    switch (color) {
        case "GREEN":
            return { "background-color": COLORS.GREEN };
        case "RED":
            return { "background-color": COLORS.RED };
        case "WHITE":
            return { "background-color": COLORS.WHITE };
        case "GRAY":
            return { "background-color": COLORS.GRAY };
        case "BLUE":
        default:
            return { "background-color": COLORS.BLUE };
    }
};

// ############################################## Events ##############################################
const emits = defineEmits(["@trigger"]);

const handleClick = () => {
    emits("@trigger");
};

// ############################################## Expose ##############################################
const update = (newProps: IButton) => {
    buttonProps.value = newProps;
};

const updateText = (newText: any) => {
    buttonProps.value.text = newText;
};

const updateLoading = (newLoading: boolean) => {
    isLoading.value = newLoading;

    if (el.value) {
        if (newLoading) {
            el.value.classList.add("loading");
        } else {
            el.value.classList.remove("loading");
        }
    }
};

onMounted(() => {
    update(props.data);
});

defineExpose(
    {
        update,
        updateText,
        updateLoading
    });
</script>
<template>
    <button @click="handleClick" :style="defaultStyle" class="text-[14px] flex items-center justify-center font-semibold text-center text-white disabled:bg-gray-600">
        {{ buttonProps.text }}
    </button>
</template>
  
<script setup lang="ts">
import type { IButton } from "../types/Button";
import { PropType, computed, onMounted, ref } from "vue";

const COLORS = {
    BLUE: "#166CF7",
    GREEN: "#69AF31",
    RED: "#D0454A",
    GRAY: "#A2A2A2",
    WHITE: "#FFF",
    TRANSPARENT: "transparent",
};

const props = defineProps({
    data: {
        type: Object as PropType<IButton>,
        required: true,
    },
});

const buttonProps = ref(props.data);

const defaultStyle = computed(() => {
    return {
        ...getSizeStyle(buttonProps.value.size),
        ...getBorderRadiusStyle(buttonProps.value.size, buttonProps.value.borderRadius),
        ...getColorStyle(buttonProps.value.type, buttonProps.value.color),
    };
});

// ############################################## Functions ##############################################
const getSizeStyle = (size: "BASE" | "XS") => {
    return size === "XS" ? { padding: "8px 17px" } : { padding: "13px 20px" };
};

const getBorderRadiusStyle = (size: "BASE" | "XS", borderRadius?: "BASE" | "FULL") => {
    if (size === "XS") {
        return { "border-radius": "9999px" };
    } else {
        return borderRadius === "FULL" ? { "border-radius": "100%" } : { "border-radius": "14px" };
    }
};

const getColorStyle = (type: "PRIMARY" | "SECONDARY", color: "BLUE" | "GREEN" | "RED" | "WHITE" | "GRAY") => {
    const { TRANSPARENT, BLUE, GREEN, RED, GRAY, WHITE } = COLORS;

    if (type === "SECONDARY") {
        switch (color) {
            case "RED":
                return { "background-color": TRANSPARENT, "border-color": RED, color: RED, "border-width": "2px" };
            case "GRAY":
                return { "background-color": TRANSPARENT, "border-color": GRAY, color: GRAY, "border-width": "2px" };
            case "BLUE":
            default:
                return { "background-color": TRANSPARENT, "border-color": BLUE, color: BLUE, "border-width": "2px" };
        }
    }

    switch (color) {
        case "GREEN":
            return { "background-color": GREEN };
        case "RED":
            return { "background-color": RED };
        case "WHITE":
            return { "background-color": WHITE };
        case "GRAY":
            return { "background-color": GRAY };
        case "BLUE":
        default:
            return { "background-color": BLUE };
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

const updateText = (newText: string) => {
    buttonProps.value.text = newText;
};

onMounted(() => {
    update(props.data);
});

defineExpose(
    {
        update,
        updateText
    });
</script>
  
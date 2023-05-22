<template>
    <button @click="handleClick" :class="customClasses" class="text-[14px] flex items-center justify-center font-semibold text-center text-white disabled:bg-gray-600 gap-x-2 bg-primary">
        {{ props.data.text }}
    </button>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";

const props = defineProps({
    data: {
        type: Object as PropType<IButton>,
        required: true
    }
});

interface IButton {
    text: string;
    type: "PRIMARY" | "SECONDARY";
    color: "BLUE" | "GREEN" | "RED";
    size: "BASE" | "XS";
    borderRadius?: "BASE" | "FULL";
}

const size = (): string => {
    switch (props.data.size) {
        case "XS":
            return "px-8 py-4";
        default:
            return "px-10 py-8";
    }
}

const borderRadius = (): string => {
    if (props.data.borderRadius) {
        switch (props.data.borderRadius) {
            case "BASE":
                return "rounded-[14px]";
            case "FULL":
                return "rounded-full";
            default:
                return "";
        }
    }
    else if (props.data.size === "XS") {
        return "rounded-full";
    }
    else {
        return "rounded-[14px]";
    }
}

const color = (): string => {
    switch (props.data.color) {
        case "BLUE":
            return "bg-primary";
        case "GREEN":
            return "bg-custom-green";
        case "RED":
            return "bg-custome-red";

        default:
            return "";
    }
}

const customClasses = (): string => {
    return size() + " " + borderRadius() + " " + color();
}

// ############################################## Events ##############################################
const emtis = defineEmits(["@trigger"]);

const handleClick = () => {
    emtis("@trigger");
}

</script>
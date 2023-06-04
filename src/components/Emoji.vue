<template>
    <object :style="getStyle()" :data="'/src/assets/emojis/' + props.data.name + '.svg'" type="image/svg+xml"></object>
</template>

<script setup lang="ts">
import { PropType, StyleValue } from "vue";

const props = defineProps({
    data: {
        type: Object as PropType<{
            name: string;
            size: "DEFAULT" | "INTEREST" | "PROFILE" | "EVENT" | "BIG";
        }>,
        required: true
    }
});

const getStyle = (): StyleValue => {
    switch (props.data.size) {
        case "INTEREST":
            return { "width": "18px", "height": "20px" };

        case "PROFILE":
            return { "width": "26px", "height": "26px" };

        case "EVENT":
            return { "width": "50px", "height": "50px" };

        case "BIG":
            return { "width": "250px", "height": "250px" };

        case "DEFAULT":
        default:
            return { "width": "25px", "height": "25px" };
    }
}

</script>
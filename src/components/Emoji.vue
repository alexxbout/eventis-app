<template>
    <object :style="getStyle()" :data="'/src/assets/emojis/' + props.data.name + '.svg'" type="image/svg+xml"></object>
</template>

<script setup lang="ts">
import { PropType, StyleValue } from "vue";
import type { IEmoji } from "../types/Emoji";

const props = defineProps({
    data: {
        type: Object as PropType<IEmoji>,
        required: true
    }
});

const getStyle = (): StyleValue => {
    switch (props.data.size) {
        case "BASE":
            return { "width": "25px", "height": "25px" };
        case "XS":
            return { "width": "18px", "height": "20px" };
        case "XL":
            return { "width": "50px", "height": "50px" };
    }
}

</script>
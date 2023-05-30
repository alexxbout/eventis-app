<template>
    <img class="" :style="getStyle" :src="'/src/assets/' + props.data.name + '.svg'" alt="Emoji">
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
            return { "width": "20px", "height": "20px" };
        case "XS":
            return { "width": "14px", "height": "14px" };
        case "XL":
            return { "width": "50px", "height": "50px" };
    }
}

</script>
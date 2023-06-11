<template>
    <div class="w-max h-max">
        <object class="pointer-events-none" :style="getStyle()" :data="'/src/assets/emojis/' + props.data.name + '.svg'" type="image/svg+xml"></object>
    </div>
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
            return { "width": "20px", "height": "20px", "shape-rendering": "optimizeSpeed", "textRendering": "optimizeSpeed", "colorRendering": "optimizeSpeed" };

        // case "USER_CARD"

        case "PROFILE":
            return { "width": "30px", "height": "30px", "shape-rendering": "optimizeSpeed", "textRendering": "optimizeSpeed", "colorRendering": "optimizeSpeed" };

        case "EVENT":
            return { "width": "50px", "height": "50px", "shape-rendering": "optimizeSpeed", "textRendering": "optimizeSpeed", "colorRendering": "optimizeSpeed" };

        case "BIG":
            return { "width": "250px", "height": "250px", "shape-rendering": "optimizeSpeed", "textRendering": "optimizeSpeed", "colorRendering": "optimizeSpeed" };

        case "DEFAULT":
        default:
            return { "width": "45px", "height": "45px", "shape-rendering": "optimizeSpeed", "textRendering": "optimizeSpeed", "colorRendering": "optimizeSpeed" };
    }
}
</script>
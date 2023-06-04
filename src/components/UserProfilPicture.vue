<template>
    <div v-if="props.data.pic" class="bg-center bg-no-repeat bg-cover rounded-full aspect-square" :style="{
            backgroundImage: 'url(' + UtilsApi.getImage('users', props.data.pic) + ')',
            width: getSize(),
            height: getSize()
        }"></div>
        
    <div v-else class="flex items-center justify-center rounded-full aspect-square bg-[#ECF3FD]" :style="{
            width: getSize(),
            height: getSize()
        }">
        <i class="text-2xl bi bi-person-fill"></i>
    </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

import UtilsApi from "../utils/UtilsApi";

const props = defineProps({
    data: {
        type: Object as PropType<{
            pic?: string,
            style: "SMALL" | "MEDIUM" | "LARGE" | "BIG"
        }>,
        required: true
    }
});

const getSize = (): string => {
    switch (props.data.style) {
        case "SMALL": // UserCard inline
            return "45px";
        case "MEDIUM": // UserCard default
            return "60px";
        case "LARGE": // Profil / Settings
            return "90px";
        case "BIG": // Add picture / Profil of another user
            return "140px";
    }
};

</script>
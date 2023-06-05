<template>
    <!-- <div class="flex items-center justify-center w-full h-max gap-x-5"> -->
        <div :style="{'border-color': color, 'color': color}" class="flex flex-col items-center justify-center w-full border-[3px] rounded-2xl h-max gap-y-2 p-2">
            <Emoji :data="{ name: props.data.emoji, size: 'PROFILE' }" />
            <span class="font-medium">{{ props.data.name }}</span>
        </div>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { PropType, ref} from "vue";

import type { IInterest } from "../types/Interest";

import Emoji from "./Emoji.vue";

// ########################################### VARIABLES ###########################################

const props = defineProps({
    data: {
        type: Object as PropType<IInterest>,
        required: true
    }
});

const color = ref<string>(props.data.color ? props.data.color : "#000000");

// ########################################### EVENTS ###########################################

// ########################################### HANDLERS ###########################################

</script>
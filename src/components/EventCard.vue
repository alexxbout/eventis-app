<template>
    <!-- Card wrapper -->
    <div class="w-full h-max" @click="openEvent">

        <!-- Card -->
        <div class="relative w-full overflow-hidden bg-white h-max rounded-2xl" :class="props.hideImage ? '' : 'shadow-card'">

            <!-- Image -->
            <div v-if="!props.hideImage">
                <div v-if="props.data.pic" :style="{ backgroundImage: 'url(' + UtilsApi.getImage('events', props.data.pic) + ')', filter: passed ? 'grayscale(1)' : '' }" class="h-[350px] w-full bg-no-repeat bg-cover bg-center"></div>
                <div v-else class="h-[350px] w-full"></div>
            </div>

            <!-- Info -->
            <div class="flex items-center w-full p-5 h-max gap-x-4">
                <Emoji v-if="props.data.emoji" :data="{ name: props.data.emoji, size: 'EVENT' }" />

                <div class="gap-y-[5px] flex flex-col justify-center">
                    <span class="font-semibold" :class="props.hideImage ? 'text-[20px]' : 'text-[24px]'">{{ data.title }}</span>

                    <span class="text-custom-gray text-[14px] font-light">{{ data.city }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import type { IEvent } from "../types/Event";

import UtilsApi from "../utils/UtilsApi";

import Emoji from "./Emoji.vue";

const props = defineProps({
    data: {
        type: Object as PropType<IEvent>,
        required: true
    },
    hideImage: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();

const passed = ref<boolean>(false);

const openEvent = () => {
    router.push({ name: "eventDetail", params: { id: props.data.id } });
};

onMounted(() => {
    const date = new Date(props.data.start);

    if (date < new Date()) {
        passed.value = true;
    }
});
</script>
<template>
    <!-- Search -->
    <div v-show="opened" ref="container" class="fixed bottom-0 z-20 w-screen h-screen">
        <div class="w-full h-1/4" @click="close"></div>

        <div ref="search" id="search_header" class="h-3/4 w-full rounded-t-[35px] bg-white overscroll-contain">
            <div class="flex flex-col p-8 overflow-y-auto h-max gap-y-5">
                <div>
                    <span class="text-3xl font-semibold text-black">Recherche</span>
                </div>

                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i class="bi bi-search text-[#818181] text-lg"></i>
                    </div>
                    <input type="text" class="bg-[#EEEFF1] placeholder-[#818181] rounded-lg block w-full pl-10 p-2.5" placeholder="Recherche">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import gsap from "gsap";

import type { IApp } from "../types/App";

import { ref, PropType, onMounted } from "vue";

// ########################################### VARIABLES ###########################################

const props = defineProps({
    app: {
        type: Object as PropType<IApp>,
        required: true
    }
});

const opened = ref(false);

const container = ref<HTMLElement | null>(null);
const search = ref<HTMLElement | null>(null);

// ########################################### FUNCTIONS ###########################################

const close = () => {
    gsap.to(search.value, { duration: 0.7, translateY: "100%", ease: "power3.out" }).then(() => {
        opened.value = false;
        props.app.removeFixed();
    });
}

const open = () => {
    opened.value = true;
    props.app.setFixed();

    gsap.to(search.value, { duration: 0.7, translateY: "0%", ease: "power3.out" });

}

onMounted(() => {
    gsap.to(search.value, { translateY: "100%" });
});

defineExpose({ open });
</script>
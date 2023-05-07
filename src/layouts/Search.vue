<template>
    <!-- Search -->
    <div v-show="opened" class="fixed h-screen w-screen z-20 bottom-0">
        <div class="h-1/4 w-full" @click="close"></div>

        <div id="search_header" class="h-3/4 w-full rounded-t-[35px] bg-white overscroll-contain shadow-card">
            <div class="h-max overflow-y-auto flex flex-col gap-y-5 p-8">
                <div>
                    <span class="text-black text-3xl font-medium">Recherche</span>
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
import type { IApp } from "../types/interfaces";

import { ref, PropType, onMounted } from "vue";

const props = defineProps({
    app: {
        type: Object as PropType<IApp>,
        required: true
    }
});

// ########################################### Variables ###########################################
const opened = ref(false);

// ########################################### Fonctions ###########################################
const close = () => {
    opened.value = false;
    props.app.removeFixed();
}

const open = () => {
    opened.value = true;
    props.app.setFixed();
}

defineExpose({ open });

onMounted(() => {
    console.log(props.app);
});
</script>
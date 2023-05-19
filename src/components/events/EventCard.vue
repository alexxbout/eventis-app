<template>
    <!-- Card wrapper -->
    <div :style="{ height: (topCardSize + bottomCardSize) + 'px' }" class="w-full">

        <!-- Card -->
        <div :style="{ height: (topCardSize + bottomCardSize) + 'px' }" class="relative w-full shadow-card overflow-hidden rounded-2xl bg-white overscroll-contain">

            <!-- Image -->
            <div :style="{ backgroundImage: 'url(' + data.image + ')', height: topCardSize + 'px' }" class="w-full bg-no-repeat bg-cover bg-center">
            </div>

            <!-- Info -->
            <div :style="{ height: bottomCardSize + 'px' }" class="w-full flex flex-col p-5">
                <span :class="{ 'text-custom-gray': !data.ended, 'text-custom-red': data.ended }" class="uppercase font-semibold text-sm">
                    {{ data.ended ? "Évènement terminé" : "Évènement en cours" }}
                </span>

                <span class="text-2xl font-semibold text-black">{{ data.title }}</span>

                <span class="text-custom-gray text-sm font-light">{{ data.subtitle }}</span>
            </div>

            <!-- Content -->
            <div class="p-5 hidden pb-14">
                <div v-for="data in props.data.description" class="flex-col flex gap-y-5 text-custom-gray">
                    <span>{{ data }}</span>
                    <br>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IEvent } from "@/types/interfaces";

import { ref, PropType } from "vue";

const props = defineProps({
    data: {
        type: Object as PropType<IEvent>,
        required: true
    }
});

const topCardSize = ref(350);
const bottomCardSize = ref(115);

</script>
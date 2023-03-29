<template>
    <div class="w-full flex flex-col rounded-2xl h-max overflow-hidden shadow-custom">
        <!-- Image -->
        <div :style="{ backgroundImage: 'url(' + data.image + ')' }" class="h-[366px] w-full bg-no-repeat bg-cover">
        </div>

        <!-- Info -->
        <div class="h-[115px] w-full flex flex-col p-5">
            <span :class="{ 'text-custom-gray': !data.ended, 'text-custom-red': data.ended }"
                class="uppercase font-semibold text-sm"> {{ data.ended ? "Évènement terminé" : "Évènement en cours"
                }}</span>

            <span class="text-2xl font-semibold text-secondary">{{ data.title }}</span>

            <span class="text-custom-gray text-sm font-light">{{ data.subtitle }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

export interface IEvent {
    title: string;
    subtitle: string;
    ended: boolean;
    image: string;
}

defineProps({
    data: {
        type: Object as PropType<IEvent>,
        required: true
    }
});
</script>
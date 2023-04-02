<template>
    <div ref="card" class="fixed h-screen w-screen z-20 bottom-0">
        <div class="h-1/4 w-full" @click="searchCallBack"></div>

        <div class="h-3/4 w-full rounded-t-[35px] bg-white p-8 shadow-card overscroll-contain">
            <div class="h-full overflow-y-auto">
                <div>
                    <span class="font-semibold text-3xl text-black">Recherche</span>
                </div>

                <div class="h-screen"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, Ref, ref } from "vue";
import { gsap } from "gsap";

defineProps({
    searchCallBack: {
        type: Function as PropType<() => void>,
        required: true
    }
});

const card = ref<HTMLElement | null>(null);

defineExpose({
    card
});

</script>
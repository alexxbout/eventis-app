<template>
    <!-- Card wrapper -->
    <div class="h-max w-full" @click="openEvent">

        <!-- Card -->
        <div class="h-max relative w-full shadow-card overflow-hidden rounded-2xl bg-white overscroll-contain">

            <!-- Image -->
            <div :style="{ backgroundImage: 'url(http://localhost:8080/image/events/' + props.data.pic + ')' }" class="h-[350px] w-full bg-no-repeat bg-cover bg-center"></div>

            <!-- Info -->
            <div class="h-max w-full flex flex-col justify-center p-5 gap-y-[5px]">
                <span class="text-[24px] font-semibold text-black">{{ data.title }}</span>

                <span class="text-custom-gray text-[14px] font-light">{{ data.city }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IEvent } from "../../types/Event";
import { ref, PropType } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    data: {
        type: Object as PropType<IEvent>,
        required: true
    }
});

const router = useRouter();

function openEvent() {
    router.push({ name: "eventDetail", params: { id: props.data.id } });
}

</script>
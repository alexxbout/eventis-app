<template>
    <!-- Loading -->
    <!-- <div v-if="isLoading" class="w-full h-max">
        <div class="relative w-full overflow-hidden h-max shadow-card rounded-2xl">
            <div class="h-[350px] w-full loading"></div>

            <div class="h-max w-full flex flex-col justify-center p-5 gap-y-[5px] bg-white">
                <div class="loading w-2/3 rounded-md h-1/3 text-transparent text-[24px] font-semibold">Loading</div>

                <div class="loading w-1/3 rounded-md h-2/3 text-transparent text-[14px] font-light">Loading</div>
            </div>
        </div>
    </div> -->

    <!-- Card wrapper -->
    <div class="w-full h-max" @click="openEvent">

        <!-- Card -->
        <div class="relative w-full overflow-hidden bg-white h-max shadow-card rounded-2xl">

            <!-- Image -->
            <div v-if="props.data.pic" :style="{ backgroundImage: 'url(' + UtilsApi.getImage('events', props.data.pic) + ')', filter: passed ? 'grayscale(1)' : '' }" class="h-[350px] w-full bg-no-repeat bg-cover bg-center"></div>
            <div v-else class="h-[350px] w-full"></div>

            <!-- Info -->
            <div class="h-max w-full flex flex-col justify-center p-5 gap-y-[5px]">
                <span class="text-[24px] font-semibold text-black">{{ data.title }}</span>

                <span class="text-custom-gray text-[14px] font-light">{{ data.city }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import type { IEvent } from "../../types/Event";
import UtilsApi from "../../utils/UtilsApi";

const props = defineProps({
    data: {
        type: Object as PropType<IEvent>,
        required: true
    }
});

const router = useRouter();

const passed = ref<boolean>(false);

// const isLoading = ref<boolean>(true);

const openEvent = () => {
    router.push({ name: "eventDetail", params: { id: props.data.id } });
}

onMounted(() => {
    const date = new Date(props.data.start);

    if (date < new Date()) {
        passed.value = true;
    }
});

// const updateLoading = (newLoading: boolean) => {
//     isLoading.value = newLoading;

//     console.log(isLoading.value);
// }

// defineExpose({
//     updateLoading
// });
</script>
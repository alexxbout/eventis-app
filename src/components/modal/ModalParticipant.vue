<template>
    <div ref="container" v-show="visible" class="fixed bottom-0 flex flex-col justify-end w-screen h-screen backdrop-blur-md bg-gray-600/10">

        <div class="modal bg-white w-full max-h-[50%] h-max rounded-t-[35px] justify-between flex flex-col p-12 gap-y-10">
            <!-- Header -->
            <div class="flex items-center justify-between w-full h-max">
                <span class="header-xs">Participants</span>

                <i @click="hide" class="text-3xl text-black bi bi-x-circle-fill"></i>
            </div>

            <!-- Users -->
            <div class="flex flex-col w-full overflow-y-auto overflow-hidden max-h-[1/2] h-max gap-y-5">
                <UserCard v-for="participant in props.data" :key="participant.id" :data="participant.user" :style="{shape: EUserCardStyle.FRIEND_PROFILE}" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref, onMounted } from "vue";

import { EUserCardStyle } from "../../types/UserCardStyle";
import type { IParticipant } from "../../types/Participants";

import UserCard from "../user/UserCard.vue";

// ############################################## VARIABLES ##############################################

const props = defineProps({
    data: {
        type: Array as PropType<IParticipant[]>,
        required: true
    }
});

const visible = ref(false);

const container = ref<HTMLElement | null>(null);

// ############################################## FUNCTIONS ##############################################

onMounted(() => {
    if (container.value) {
        container.value.addEventListener("click", (event) => {
            if (visible.value) {
                if (event.target === container.value) {
                    hide();
                }
            }
        });
    }
});


const hide = () => {
    visible.value = false;
}

const show = () => {
    visible.value = true;
}

defineExpose({
    hide,
    show
});

</script>
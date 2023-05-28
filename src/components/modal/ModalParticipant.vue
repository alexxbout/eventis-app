<template>
    <div v-show="visible" class="fixed bottom-0 flex flex-col w-screen h-screen">

        <div @click="visible = !visible" class="w-full h-full"></div>

        <div class="bg-white w-full h-max rounded-t-[35px] shadow-modal justify-between flex flex-col p-12 gap-y-10">
            <!-- Header -->
            <div class="w-full h-max flex justify-between items-center">
                <span class="header-xs">Participants</span>

                <i @click="hide" class="bi bi-x-circle-fill text-3xl text-black"></i>
            </div>

            <!-- Users -->
            <div class="w-full h-max overflow-y-auto flex flex-col gap-y-5">
                <UserCard v-for="participant in props.data" :key="participant.id" :data="participant.user" :style="{shape: EUserCardStyle.RECTANGLE}" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref, onMounted } from "vue";

import { EUserCardStyle } from "../../types/UserCardStyle";
import type { IParticipant } from "../../types/Participants";

import UserCard from "../user/UserCard.vue";

const props = defineProps({
    data: {
        type: Array as PropType<IParticipant[]>,
        required: true
    }
});

const visible = ref(false);

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
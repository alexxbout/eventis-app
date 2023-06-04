<template>
    <div ref="container" v-show="visible" class="fixed bottom-0 flex flex-col justify-end w-screen h-screen opacity-0 backdrop-blur-lg bg-gray-600/10">

        <div ref="modal" class="modal bg-white w-full max-h-[50%] h-max rounded-t-[35px] justify-between flex flex-col p-10 gap-y-10">
            <!-- Header -->
            <div class="flex items-center justify-between w-full h-max">
                <span class="header-xs">Participants</span>

                <i @click="hide" class="text-3xl text-black bi bi-x-circle-fill"></i>
            </div>

            <!-- Users -->
            <div class="flex flex-col w-full overflow-y-auto overflow-hidden max-h-[1/2] h-max gap-y-5">
                <UserCard v-for="participant in props.data" :key="participant.id" :data="{ user: participant.user, action: 'SHOW_PROFIL', style: 'RECTANGLE' }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import gsap from "gsap";

import { PropType, ref, onMounted, onUnmounted } from "vue";

import type { IParticipant } from "../types/Participants";

import UserCard from "./UserCard.vue";

// ############################################## VARIABLES ##############################################

const props = defineProps({
    data: {
        type: Array as PropType<IParticipant[]>,
        required: true
    }
});

const visible = ref(false);

const container = ref<HTMLElement | null>(null);
const modal = ref<HTMLElement | null>(null);

// ############################################### EVENTS ###############################################

// ############################################## FUNCTIONS ##############################################

onMounted(() => {
    if (container.value) {
        container.value.addEventListener("click", handleClickOutside);
    }
});

onUnmounted(() => {
    if (container.value) {
        container.value.removeEventListener("click", handleClickOutside);
    }
});

const handleClickOutside = (event: MouseEvent) => {
    if (visible.value) {
        if (container.value) {
            if (event.target === container.value) {
                hide();
            }
        }
    }
}

const hide = () => {
    let tl = gsap.timeline();

    tl.fromTo(modal.value,
        {
            translateY: 0,
        },
        {
            translateY: "100%",
            duration: 0.3,
            ease: "power2.out"
        }).then(() => {
            visible.value = false;
        });

    tl.to(container.value,
        {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        }, "<0.1");
}

const show = () => {
    visible.value = true;

    gsap.to(container.value,
        {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });

    gsap.fromTo(modal.value,
        {
            translateY: "100%",
        }, {
        translateY: 0,
        duration: 0.3,
        ease: "power2.out"
    });
}

defineExpose({
    hide,
    show
});

</script>
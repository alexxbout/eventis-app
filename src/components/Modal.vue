<template>
    <div ref="container" v-show="visible" class="fixed bottom-0 flex flex-col justify-end w-screen h-screen z-30">

        <div ref="modal" class="modal bg-white w-full max-h-[50%] h-max rounded-t-[35px] justify-between flex flex-col p-10 gap-y-10 shadow-modal">
            <!-- Header -->
            <div class="flex items-center justify-between w-full h-max">
                <span class="header-xs">{{ props.data.header.title }}</span>

                <i v-if="props.data.header.closeButton" @click="hide" class="text-[27px] bi bi-x-circle-fill"></i>
            </div>

            <!-- Users -->
            <div class="flex flex-col w-full overflow-y-auto overflow-hidden max-h-[1/2] h-max gap-y-5">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { gsap, Power4 } from "gsap";

import { PropType, ref, onMounted, onUnmounted } from "vue";

// ############################################## VARIABLES ##############################################

const props = defineProps({
    data: {
        type: Object as PropType<{
            header: {
                title: string;
                closeButton: boolean;
            }
        }>,
        required: true
    }
});

const visible = ref(false);
const container = ref<HTMLElement | null>(null);
const modal = ref<HTMLElement | null>(null);

// ############################################### EVENTS ###############################################

const emit = defineEmits(["@hide", "@show"]);

// ############################################## HOOKS ##############################################

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

// ############################################## FUNCTIONS ##############################################

const hide = () => {
    emit("@hide");

    gsap.fromTo(modal.value,
        {
            translateY: 0,
        },
        {
            translateY: "150%",
            duration: 0.5,
            ease: Power4.easeInOut
        }).then(() => {
            visible.value = false;
        });
};

const show = () => {
    emit("@show");
    visible.value = true;

    gsap.fromTo(modal.value,
        {
            translateY: "150%",
        },
        {
            translateY: 0,
            duration: 0.5,
            ease: Power4.easeOut
        });
};

// ############################################### HANDLERS ###############################################

const handleClickOutside = (event: MouseEvent) => {
    if (visible.value) {
        if (container.value) {
            if (event.target === container.value) {
                hide();
            }
        }
    }
};

// ############################################### EXPORTS ###############################################

defineExpose({
    hide,
    show
});

</script>
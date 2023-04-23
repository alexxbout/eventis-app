<template>
    <!-- Card wrapper -->
    <div :style="{ height: (topCardSize + bottomCardSize) + 'px' }" class="w-full">

        <!-- Card -->
        <div ref="card" @touchstart="touchStart" @touchend="touchEnd" @click="openCard" :style="{ height: (topCardSize + bottomCardSize) + 'px' }" class="relative w-full shadow-card overflow-hidden rounded-2xl bg-white overscroll-contain">

            <!-- Image -->
            <div ref="topCard" :style="{ backgroundImage: 'url(' + data.image + ')', height: topCardSize + 'px' }" class="w-full bg-no-repeat bg-cover bg-center">
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
            <div ref="content" class="p-5 hidden pb-14">
                <div v-for="data in props.data.description" class="flex-col flex gap-y-5 text-custom-gray">
                    <span>{{ data }}</span>
                    <br>
                </div>
            </div>
        </div>

        <i ref="close" @click="closeCard" class="bi bi-x-circle-fill text-3xl text-black hidden fixed top-5 right-5 z-10"></i>
    </div>
</template>

<script setup lang="ts">
/**
 * NB: Pour les animations avec GSAP, on préfère les définir dans une constante globale afin de pouvoir appeler la fonction reverse() par la suite.
 * Cependant, les animations de ce composant ne peuvent pas être enregistrées dans une variable globale car certains paramètres (comme la taille de la carte) ne sont pas encore définis.
 */

import { IApp } from "../App.vue";
import { ref, PropType, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

export interface IEvent {
    title: string;
    subtitle: string;
    ended: boolean;
    image: string;
    description?: Array<string>;
}

const props = defineProps({
    data: {
        type: Object as PropType<IEvent>,
        required: true
    },
    funcs: {
        type: Object as PropType<IApp>,
        required: true
    }
});

const opened = ref(false);

const topCardSize = ref(350);
const bottomCardSize = ref(115);

const card = ref<HTMLElement>();
const topCard = ref<HTMLElement>();
const content = ref<HTMLElement>();
const close = ref<HTMLElement>();

function openCard() {
    if (!card.value || !topCard.value || !content.value || !close.value || opened.value) return;

    // Update opened value
    opened.value = true;

    // Hide navbar
    props.funcs.hideNavbar();

    // Reset card size (in case of touch event)
    card.value.style.transform = "scale(1)";

    // Remove box-shadow of card to improve performances
    card.value.classList.remove("shadow-card");

    // Allow scroll on card
    card.value.style.overflowY = "scroll";


    const tl = gsap.timeline();

    tl.to(card.value, {
        translateX: card.value.getBoundingClientRect().left * -1 + "px",
        translateY: card.value.getBoundingClientRect().top * -1 + "px",
        width: "100vw",
        height: "100vh",
        borderRadius: "0",
        zIndex: "10",
        duration: 1,
        ease: "elastic.out(1, 1)",
    });

    tl.fromTo(close.value,
        {
            opacity: 0
        },
        {
            onStart: () => {
                // Show close button
                close.value?.classList.remove("hidden");
            },
            opacity: 1,
            duration: 0.5
        }, "<0.5");

    content.value.classList.remove("hidden");

    // Animate content
    gsap.fromTo(content.value,
        {
            opacity: 0
        },
        {
            opacity: 1,
            duration: 1.5,
            ease: "power4.out"
        });

    // Set body fixed to prevent scroll
    props.funcs.setFixed();
}

function closeCard() {
    if (!card.value || !topCard.value || !content.value || !close.value || !opened.value) return;

    // Show navbar
    props.funcs.showNavbar();

    // Restore box-shadow of card
    card.value.classList.add("shadow-card");

    // Hide close button
    close.value?.classList.add("hidden");

    // Scroll to top
    card.value?.scrollTo(0, 0);

    // Prevent card scroll
    card.value.style.overflowY = "hidden";

    // Remove body fixed for scroll
    props.funcs.removeFixed();

    // Animate card
    gsap.to(card.value, {
        translateX: "0",
        translateY: "0",
        width: "100%",
        height: (topCardSize.value + bottomCardSize.value) + "px",
        borderRadius: "1rem",
        zIndex: "1",
        duration: 1.2,
        ease: "elastic.out(1, 1.2)",
    }).then(() => {
        // Update opened value
        opened.value = false;
    });

    // Hide content
    content.value.classList.add("hidden");
}

function touchStart() {
    if (!card.value || opened.value) return;

    gsap.to(card.value, {
        scale: 0.93,
        duration: 0.5
    });
}

function touchEnd() {
    if (!card.value || opened.value) return;

    gsap.to(card.value, {
        scale: 1,
        duration: 0.5
    });
}

</script>
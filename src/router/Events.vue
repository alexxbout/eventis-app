<template>
    <div class="flex flex-col gap-y-10 mb-20 relative">

        <div class="flex flex-col gap-y-2">
            <span class="uppercase text-custom-gray font-semibold text-sm">{{ date }}</span>

            <div class="w-full flex items-center justify-between">
                <span class="header">Évènements</span>

                <img class="rounded-full w-10 h-10" src="../assets/memoji.png" alt="">
            </div>
        </div>

        <EventCard v-for="event in events" :data="event" />
    </div>
</template>

<script setup lang="ts">
import type { IEvent } from "../types/interfaces";

import EventCard from "../components/EventCard.vue"
import { ref } from "vue"

// ########################################### Variables ###########################################  
const date = ref(new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
}));

// TODO: Remplacer par une requête API
const events = ref<IEvent[]>([
    ...Array.from({ length: 5 }, () => ({
        title: "Jardin de Versailles",
        subtitle: "Versailles",
        ended: false,
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",

        description: [
            "Le jardin de Versailles, également appelé jardin du château de Versailles ou, au pluriel, les jardins de Versailles ou les jardins du château de Versailles, est situé à l'ouest du château de Versailles.",
            "Conçu par André Le Nôtre pour Louis XIV, il fut aménagé entre 1661 et 1700. Il s'étend sur 800 hectares, dont 93 sont occupés par les jardins à la française. Il est bordé au sud par l'avenue de Paris, à l'ouest par le Grand Canal, au nord par la place d'Armes et à l'est par le château. Il est classé au patrimoine mondial de l'UNESCO depuis 1979.",
            "Ce jardin est l'un des plus célèbres au monde, et le plus vaste de l'époque moderne. Il est l'archétype du jardin à la française, qui a exercé une influence considérable dans la plupart des pays européens et au-delà. Il est aujourd'hui l'un des lieux les plus visités de France, avec 7,5 millions de visiteurs en 2010."
        ]
    }))
]);

</script>
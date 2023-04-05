<template>
    <div class="flex flex-col gap-y-10 mb-20">

        <div class="flex flex-col gap-y-2">
            <span class="uppercase text-custom-gray font-semibold text-sm">{{ date }}</span>
            
            <div class="w-full flex items-center justify-between">
                <span class="header">Évènements</span>

                <img class="rounded-full w-10 h-10" src="./assets/memoji.png" alt="">
            </div>
        </div>

        <EventCard v-for="event in events" :event="event" :data="event" />
    </div>
</template>

<script setup lang="ts">
import { IEvent } from "./components/EventCard.vue"
import EventCard from "./components/EventCard.vue"
import { ref } from "vue"

const date = ref(new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
}));

const events = ref<IEvent[]>([]);

// Fake data
events.value = [
    {
        title: "Festival de danse",
        subtitle: "Rennes",
        ended: false,
        image: "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80"
    },
    {
        title: "Compétition de jeux vidéo",
        subtitle: "Rennes",
        ended: false,
        image: "https://images.unsplash.com/photo-1558244661-d248897f7bc4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80"
    },
    {
        title: "Vallée du désert",
        subtitle: "Egypte",
        ended: false,
        image: "https://images.unsplash.com/photo-1605106702842-01a887a31122?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
    },
    {
        title: "Festival de danse",
        subtitle: "France",
        ended: true,
        image: "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80"
    }
];

</script>
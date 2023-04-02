<template>
    <div class="flex flex-col gap-y-10 mb-20">

        <div class="flex flex-col gap-y-2">
            <span class="uppercase text-custom-gray font-semibold text-sm">{{ date }}</span>
            <span class="text-4xl font-bold text-black">Évènements</span>
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
        image: "https://picsum.photos/id/639/1000/1000"
    },
    {
        title: "Compétition de jeux vidéo",
        subtitle: "Rennes",
        ended: false,
        image: "https://picsum.photos/id/830/1000/1000"
    },
    {
        title: "Vallée du désert",
        subtitle: "Egypte",
        ended: true,
        image: "https://picsum.photos/id/525/1000/1000"
    }
];

</script>
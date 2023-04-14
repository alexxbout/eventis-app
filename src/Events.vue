<template>
    <div class="flex flex-col gap-y-10 mb-20 relative">

        <div class="flex flex-col gap-y-2">
            <span class="uppercase text-custom-gray font-semibold text-sm">{{ date }}</span>

            <div class="w-full flex items-center justify-between">
                <span class="header">Évènements</span>

                <img class="rounded-full w-10 h-10" src="./assets/memoji.png" alt="">
            </div>
        </div>

        <EventCard v-for="event in events" :event="event" :data="event" :funcs="props.funcs" />
    </div>
</template>

<script setup lang="ts">
import { IApp } from "./App.vue"
import { IEvent } from "./components/EventCard.vue"
import EventCard from "./components/EventCard.vue"
import { PropType, ref } from "vue"

// Get props of interface IApp from parent component
const props = defineProps(
    {
        funcs: {
            type: Object as PropType<IApp>,
            required: true
        }
    }
);

// Get current date
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
        image: "https://images.unsplash.com/photo-1636955669242-11b90050e9ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    },
    {
        title: "Compétition de jeux vidéo",
        subtitle: "Rennes",
        ended: false,
        image: "https://images.unsplash.com/photo-1634693798046-b00e706c3076?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80"
    },
    {
        title: "Vallée du désert",
        subtitle: "Egypte",
        ended: false,
        image: "https://images.unsplash.com/photo-1634694459536-8bc9bff3289e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80"
    },
    {
        title: "Festival de danse",
        subtitle: "France",
        ended: true,
        image: "https://images.unsplash.com/photo-1634693148975-362d570ca495?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80"
    }
];

</script>
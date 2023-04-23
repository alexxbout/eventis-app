<template>
    <div class="flex flex-col gap-y-10 mb-20 relative">

        <div class="flex flex-col gap-y-2">
            <span class="uppercase text-custom-gray font-semibold text-sm">{{ date }}</span>

            <div class="w-full flex items-center justify-between">
                <span class="header">Évènements</span>

                <img class="rounded-full w-10 h-10" src="./assets/memoji.png" alt="">
            </div>
        </div>

        <EventCard v-for="event in events" :data="event" :funcs="props.funcs" />
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
        title: "Jardin de Versailles",
        subtitle: "Versailles",
        ended: false,
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        
        description: [
            "Le jardin de Versailles, également appelé jardin du château de Versailles ou, au pluriel, les jardins de Versailles ou les jardins du château de Versailles, est situé à l'ouest du château de Versailles.",
            "Conçu par André Le Nôtre pour Louis XIV, il fut aménagé entre 1661 et 1700. Il s'étend sur 800 hectares, dont 93 sont occupés par les jardins à la française. Il est bordé au sud par l'avenue de Paris, à l'ouest par le Grand Canal, au nord par la place d'Armes et à l'est par le château. Il est classé au patrimoine mondial de l'UNESCO depuis 1979.",
            "Ce jardin est l'un des plus célèbres au monde, et le plus vaste de l'époque moderne. Il est l'archétype du jardin à la française, qui a exercé une influence considérable dans la plupart des pays européens et au-delà. Il est aujourd'hui l'un des lieux les plus visités de France, avec 7,5 millions de visiteurs en 2010."
        ]
    
    },
    {
        title: "Compétition de jeux vidéo",
        subtitle: "Rennes",
        ended: false,
        image: "https://images.unsplash.com/photo-1543348750-466b55f32f16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",

        description: [
            "Une compétition de jeux vidéo est un événement sportif qui consiste à opposer des joueurs de jeux vidéo dans un but de compétition.",
            "Les compétitions de jeux vidéo sont organisées par des associations, des entreprises ou des particuliers. Elles peuvent être ouvertes à tous ou être réservées à des joueurs professionnels. Les compétitions de jeux vidéo sont souvent organisées dans le cadre de salons ou de conventions de jeux vidéo, mais peuvent aussi être organisées dans des salles dédiées ou des lieux publics.",
            "Pour remporter une compétition de jeux vidéo, il faut être le meilleur joueur de la compétition. Les compétitions de jeux vidéo sont souvent organisées en plusieurs phases, avec des qualifications, des phases de poules, des phases finales et des phases de classement. Les compétitions de jeux vidéo sont souvent organisées en plusieurs phases, avec des qualifications, des phases de poules, des phases finales et des phases de classement."
        ]
    },
    {
        title: "Vallée du désert",
        subtitle: "Egypte",
        ended: false,
        image: "https://images.unsplash.com/photo-1614597396930-cd6760b99f7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    
        description: [
            "La vallée du Nil est une région du nord-est de l'Égypte, située entre le delta du Nil et le désert libyen. Elle est bordée au nord par le delta du Nil, au sud par le désert libyen, à l'est par le Sinaï et à l'ouest par le canal de Suez.",
            "Au nord-est, la vallée du Nil est bordée par la mer Méditerranée. Au sud-ouest, elle est bordée par le canal de Suez. La vallée du Nil est une région du nord-est de l'Égypte, située entre le delta du Nil et le désert libyen. Elle est bordée au nord par le delta du Nil, au sud par le désert libyen, à l'est par le Sinaï et à l'ouest par le canal de Suez."
        ]
    },
    {
        title: "Festival de danse",
        subtitle: "France",
        ended: true,
        image: "https://images.unsplash.com/photo-1682057628665-9d0d51bae482?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
    }
];

</script>
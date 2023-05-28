<template>
    <div class="relative flex flex-col mb-20 gap-y-10 margins">

        <div class="flex flex-col w-full gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i class="text-3xl bi bi-house"></i>
                <span class="header">Évènements</span>
            </div>

            <!-- Dep button -->
            <div></div>
        </div>

        <EventCard v-for="event in events" :id="event.id" :data="event" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useRouter } from "vue-router";

import EventCard from "../../components/event/EventCard.vue";

import type { IEvent } from "../../types/Event";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ########################################### VARIABLES ###########################################

const events = ref<IEvent[]>([]);

const router = useRouter();

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    // Data
    const user = UtilsAuth.getCurrentUser();

    if (user) {
        // Récupérer le zip du foyer de l'utilisateur
        let zip: string = "";

        if (user.idFoyer) {
            const foyerRequest = await UtilsApi.getFoyerById(user.idFoyer);

            if (foyerRequest) {
                zip = foyerRequest.zip.substring(0, 2);

                const zipInt = parseInt(zip);

                const eventsRequest = await UtilsApi.getEventsByZip(zipInt);

                if (eventsRequest) {
                    events.value = eventsRequest;
                }
            }
        }
    }

    // Scroll to section with id of last route param
    await router.isReady();

    router.afterEach((to, from, next) => {
        if (from.name === "eventDetail") {

            const params = from.params;

            if (params.id) {
                const id = params.id as string;

                // Timeout required to allow page to render before scrolling
                setTimeout(() => {
                    const element = document.getElementById(id);

                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }, 200);
            }
        }
    });

});

</script>
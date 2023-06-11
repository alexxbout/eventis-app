<template>
    <div v-for="data in customData" class="flex flex-col w-full gap-y-10">
        <div :id="data.zip" class="flex items-center justify-center gap-x-4">
            <div class="w-full h-px bg-gray-400 rounded-full"></div>
            <div class="text-center text-gray-400 w-min whitespace-nowrap text-lg">{{ UtilsZip.getDepartement(data.zip) }}</div>
            <div class="w-full h-px bg-gray-400 rounded-full"></div>
        </div>

        <EventCard v-for="event in data.events" :id="event.id" :data="event" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import EventCard from "../../components/EventCard.vue";

import type { IEvent } from "../../types/interfaces";

import UtilsZip from "../../utils/UtilsZip";
import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ########################################### VARIABLES ###########################################

const customData = ref<{ zip: string, events: IEvent[] }[]>([]);
const nearbyZips = ref<string[]>([]);
const user = UtilsAuth.getCurrentUser();
const router = useRouter();

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    if (user!.idFoyer) {
        const foyerRequest = await UtilsApi.getFoyerById(user!.idFoyer);

        if (foyerRequest) {
            const localZip = foyerRequest.zip.substring(0, 2);

            // Get events of local zip
            const eventsRequest = await UtilsApi.getEventsByZip(parseInt(localZip));

            if (eventsRequest) {
                customData.value.push({ zip: localZip, events: eventsRequest });
            }

            // Get nearby zips
            nearbyZips.value = UtilsZip.getNearbyZips(parseInt(localZip));

            // Get events of nearby zips
            if (nearbyZips.value.length > 0) {
                for (const zip of nearbyZips.value) {
                    const eventsRequest = await UtilsApi.getEventsByZip(parseInt(zip));

                    if (eventsRequest) {
                        customData.value.push({ zip: zip, events: eventsRequest });
                    }
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
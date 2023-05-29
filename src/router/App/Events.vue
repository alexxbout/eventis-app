<template>
    <div class="relative flex flex-col mb-20 gap-y-10 margins">

        <div class="flex items-center justify-between w-full gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i class="text-3xl bi bi-house"></i>
                <span class="header">Évènements</span>
            </div>

            <!-- Dep button -->
            <Button :icon="{ side: 'LEFT', name: ICONS.LOCATION }" :data="{ color: 'BLUE', type: 'PRIMARY', size: 'XS', text: 'Test', borderRadius: 'FULL' }" />

            <select name="pets" id="pet-select" class="hidden">
                <option value="">--Please choose an option--</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="hamster">Hamster</option>
                <option value="parrot">Parrot</option>
                <option value="spider">Spider</option>
                <option value="goldfish">Goldfish</option>
            </select>
        </div>

        <div v-for="data in events" class="flex flex-col gap-y-10 w-full">
            <div :id="data.zip" class="flex items-center justify-center gap-x-4">
                <div class="w-full h-px rounded-full bg-gray-400"></div>
                <div class="text-gray-400 w-min text-center whitespace-nowrap">{{ UtilsZip.getDepartement(data.zip) }}</div>
                <div class="w-full h-px rounded-full bg-gray-400"></div>
            </div>

            <EventCard v-for="event in data.events" :id="event.id" :data="event" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useRouter } from "vue-router";

import Button from "../../components/Button.vue";
import EventCard from "../../components/event/EventCard.vue";

import type { IEvent } from "../../types/Event";
import { ICONS } from "../../types/Button";

import UtilsZip from "../../utils/UtilsZip";
import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ########################################### VARIABLES ###########################################

const events = ref<{zip: string, events: IEvent[]}[]>([]);

const nearbyZips = ref<string[]>([]);

const router = useRouter();

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    // Data
    const user = UtilsAuth.getCurrentUser();

    if (user) {
        // Récupérer le zip du foyer de l'utilisateur
        let localZip: string = "";

        if (user.idFoyer) {
            const foyerRequest = await UtilsApi.getFoyerById(user.idFoyer);

            if (foyerRequest) {
                localZip = foyerRequest.zip.substring(0, 2);

                // Récupérer les évènements du foyer
                const eventsRequest = await UtilsApi.getEventsByZip(parseInt(localZip));

                if (eventsRequest) {
                    events.value.push({ zip: localZip, events: eventsRequest });
                }

                // Récupérer les zips à proximité
                nearbyZips.value = UtilsZip.getNearbyZips(parseInt(localZip));                

                // check if nearby zips are string[]
                if (nearbyZips.value.length > 0) {
                    console.log("Ok");
                    
                    // Récupérer les évènements à proximité
                    for (const zip of nearbyZips.value) {
                        const eventsRequest = await UtilsApi.getEventsByZip(parseInt(zip));

                        if (eventsRequest) {
                            events.value.push({ zip: zip, events: eventsRequest });

                            console.log(eventsRequest.length + " events found for zip " + zip);
                        }
                    }
                }

                console.log("Nearby zips: " + nearbyZips.value);
                console.log("Events: ", events.value);
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
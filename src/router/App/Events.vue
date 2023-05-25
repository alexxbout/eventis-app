<template>
    <div class="relative flex flex-col mb-20 gap-y-10 margins">

        <div class="w-full flex flex-col gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i class="bi bi-house text-3xl"></i>
                <span class="header">Évènements</span>
            </div>

            <!-- Dep button -->
            <div></div>
        </div>

        <EventCard v-for="event in events" :id="event.id" :data="event" />
    </div>
</template>

<script setup lang="ts">
import type { IEvent } from "../../types/Event";
import EventCard from "../../components/event/EventCard.vue"
import { onMounted, ref } from "vue"
import UtilsApi from "../../utils/UtilsApi";
import { IUser } from "../../types/User";
import UtilsAuth from "../../utils/UtilsAuth";

// ########################################### Variables ###########################################  
const events = ref<IEvent[]>([]);

onMounted(async () => {
    const user = UtilsAuth.getCurrentUser();

    if (user) {
        // Récupérer le zip du foyer de l'utilisateur
        let zip: string = "";

        if (user.idFoyer) {
            // Api pour récup le zip en fonction de l'id du foyer
            await UtilsApi.getFoyerById(user.idFoyer).then((response) => {
                zip = response.data.data.zip;
            });

            // Get two first numbers of zip
            zip = zip.substring(0, 2);

            const zipInt = parseInt(zip);

            // Récupérer les évènements en fonction du zip
            await UtilsApi.getEventsByZip(zipInt).then((response) => {
                events.value = response.data.data;

                console.log(response.data.data);
                
            });
        }
    }

});

</script>
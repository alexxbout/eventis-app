<template>
    <div ref="container" @scroll="handleScroll" @touchmove="handleScroll" @wheel="handleScroll" class="min-h-screen h-full w-screen p-[inherit]">

        <div @click="handleClose">
            <i ref="btnClose" class="fixed text-3xl text-white transition-colors bi bi-x-circle-fill top-5 right-5"></i>
        </div>

        <div class="fixed bottom-0 w-full h-20 bg-white flex p-[15px] gap-x-[15px] shadow-eventCard">
            <Button @@trigger="handleParticipate" ref="btnParticipate" class="w-full" :isLoading="true" />

            <Button @@trigger="handleModal" ref="btnParticipants" class="w-max" :isLoading="true" />
        </div>

        <!-- Header -->
        <div class="w-full h-max">
            <!-- Picture -->
            <div ref="header" class="w-full h-max">
                <div v-if="event?.pic" :style="{ backgroundImage: 'url(http://localhost:8080/image/events/' + event.pic + ')' }" class="h-[285px] w-full bg-no-repeat bg-cover bg-center"></div>
                <div v-else class="h-[285px] w-full"></div>
            </div>

            <!-- Title -->
            <div class="h-max w-full flex flex-col justify-center p-5 gap-y-[5px] bg-white border-b">
                <span class="text-[20px] font-semibold text-black">{{ event?.title }}</span>

                <span class="text-black text-[14px] font-light">
                    {{ event?.start != null && event?.city != null ? "Le " + formatDate(event.start) + " à " + event.city : "" }}
                </span>
            </div>
        </div>

        <!-- Data -->
        <div v-html="event?.description" class="p-5 text-gray-500 h-max pb-36"></div>
    </div>

    <div v-if="event?.participants">
        <ModalParticipant ref="modalParticipant" :data="event.participants" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { IEvent } from "../../types/Event";
import type { IButton } from "../../types/Button";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

import Button from "../Button.vue";
import ModalParticipant from "../modal/ModalParticipant.vue";

// ############################################### VARIABLES ###############################################

// Router
const router = useRouter();
const route = useRoute();

// Childs components refs
const modalParticipant = ref<InstanceType<typeof ModalParticipant> | null>(null);
const btnParticipate = ref<InstanceType<typeof Button> | null>(null);
const btnParticipants = ref<InstanceType<typeof Button> | null>(null);

const btnClose = ref<HTMLElement | null>(null);

const header = ref<HTMLElement | null>(null);

const container = ref<HTMLElement | null>(null);

// Data
const event = ref<IEvent>();
const isParticipating = ref(false);
const user = UtilsAuth.getCurrentUser();

const btnParticipateStyle: IButton = {
    text: "Participer",
    color: "BLUE",
    type: "PRIMARY",
    size: "BASE"
}

const btnCancelParticipateStyle: IButton = {
    text: "Annuler la participation",
    color: "RED",
    type: "SECONDARY",
    size: "BASE"
}

// ############################################### FUNCTIONS ###############################################

onMounted(async () => {
    await router.isReady();

    const routeParam = route.params.id;

    if (typeof routeParam !== "string") {
        return router.push({ name: "events" });
    }

    const idUser = user?.id as number;
    const idEvent = parseInt(routeParam);

    const eventData = await UtilsApi.getEventById(idEvent);
    const participants = await UtilsApi.getAllParticipants(idEvent);

    if (eventData && participants) {
        // Update event data
        event.value = eventData;

        // Format new lines of description
        event.value.description = event.value.description.replace(/\n/g, "<br>");

        // Update participants
        event.value.participants = participants;

        // Update participants button
        btnParticipants.value?.update({ text: participants.length, color: "BLUE", type: "SECONDARY", size: "BASE" });

        // Update participate button
        isParticipating.value = await UtilsApi.isParticipating(idEvent, idUser);

        if (isParticipating.value) {
            btnParticipate.value?.update(btnCancelParticipateStyle);
        } else {
            btnParticipate.value?.update(btnParticipateStyle);
        }

        // Remove loading
        btnParticipate.value?.updateLoading(false);
        btnParticipants.value?.updateLoading(false);
    } else {
        router.push({ name: "events" });
    }
});

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

// ############################################## HANDLERS ##############################################

const handleScroll = () => {
    if (header.value && btnClose.value) {
        const headerHeight = header.value.offsetHeight;

        if (window.scrollY > headerHeight) {
            btnClose.value.style.color = "black";
        } else {
            btnClose.value.style.color = "white";
        }
    }
}

const handleModal = () => {
    if (event.value?.participants && event.value.participants.length > 0) {
        modalParticipant.value?.show();
    }
}

const handleClose = () => {
    router.push({ name: "events" });
}

const handleParticipate = async () => {
    let nbParticipants = 0;

    const idEvent = parseInt(route.params.id as string);

    // Update participate status
    if (isParticipating.value) {
        nbParticipants = await UtilsApi.removeParticipant(idEvent, user!.id);

        if (nbParticipants != -1) isParticipating.value = false;
    } else {
        nbParticipants = await UtilsApi.addParticipant(idEvent, user!.id);

        if (nbParticipants != -1) isParticipating.value = true;
    }

    // Update participants count button
    btnParticipants.value?.updateText(nbParticipants);

    // Update participate button
    if (isParticipating.value) {
        btnParticipate.value?.update(btnCancelParticipateStyle);
    } else {
        btnParticipate.value?.update(btnParticipateStyle);
    }

    // Update participants list
    const participants = await UtilsApi.getAllParticipants(idEvent);
    if (event.value && participants) {
        event.value.participants = participants;
    }
}
</script>
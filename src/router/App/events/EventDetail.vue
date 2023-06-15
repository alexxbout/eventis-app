<template>
    <div ref="container" class="w-screen min-h-screen">

        <i @click="handleClose" class="fixed text-3xl top-5 right-5 bi bi-x-circle-fill text-black"></i>

        <div v-if="!passed" class="fixed bottom-0 flex w-full h-20 p-4 bg-white border-t gap-x-3">
            <Button @@click="handleParticipate" :data="btnParticipateStyle" :delay="1000" class="w-full" />

            <Button @@click="handleModal" :data="btnParticipantsStyle" class="w-max" />
        </div>

        <!-- Header -->
        <div class="w-full h-max">
            <!-- Picture -->
            <div ref="header" class="w-full h-max">
                <div v-if="event?.pic" :style="{ backgroundImage: 'url(' + UtilsApi.getImage('events', event.pic) + ')' }" class="h-[285px] w-full bg-no-repeat bg-cover bg-center"></div>
                <div v-else class="h-[285px] w-full"></div>
            </div>

            <!-- Title -->
            <div class="flex items-center w-full p-5 bg-white border-b h-max gap-x-5">
                <Emoji v-if="event?.emoji" :data="{ name: event.emoji, size: 'EVENT' }" />

                <div class="gap-y-[5px] flex flex-col justify-center">
                    <span class="text-[20px] font-semibold">{{ event?.title }}</span>

                    <span class="text-[14px] font-light">
                        {{ event?.start != null && event?.city != null ? "Le " + formatDate(event.start) + " à " + event.city : "" }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Data -->
        <div v-html="event?.description" class="p-5 text-gray-500 h-max pb-36"></div>
    </div>

    <div v-if="event?.participants">
        <Modal ref="modal" :data="{ header: { closeButton: true, title: 'Participants' } }">
            <UserCard v-for="participant in event.participants" :key="participant.id" :data="{ user: participant.user, action: 'SHOW_PROFIL', style: 'RECTANGLE' }" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { IEvent, IButton } from "../../../types/interfaces";

import UtilsApi from "../../../utils/UtilsApi";
import UtilsAuth from "../../../utils/UtilsAuth";

import Button from "../../../components/Button.vue";
import Emoji from "../../../components/Emoji.vue";
import Modal from "../../../components/Modal.vue";
import UserCard from "../users/UserCard.vue";

// ############################################### VARIABLES ###############################################

const router          = useRouter();
const route           = useRoute();
const user            = UtilsAuth.getCurrentUser();
const modal           = ref<InstanceType<typeof Modal> | null>(null);
const header          = ref<HTMLElement | null>(null);
const event           = ref<IEvent>();
const passed          = ref(false);
const isParticipating = ref(false);

const btnParticipantsStyle = computed<IButton>(() => {
    return {
        apparence: {
            color: "BLUE",
            type: "SECONDARY",
            size: "BASE"
        },
        icon: {
            name: "USERS",
            side: "LEFT"
        },
        text: event.value?.participants?.length
    }
});

const btnParticipateStyle = computed<IButton>(() => {
    return {
        apparence: {
            color: isParticipating.value ? "RED" : "BLUE",
            type: isParticipating.value ? "SECONDARY" : "PRIMARY",
            size: "BASE"
        },
        text: isParticipating.value ? "Annuler la participation" : "Participer"
    }
});

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

        // Update participate button
        isParticipating.value = await UtilsApi.isParticipating(idEvent, idUser);

        // Update passed
        passed.value = new Date(event.value.start) < new Date();
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

const handleModal = () => {
    if (event.value?.participants && event.value.participants.length > 0) {
        modal.value?.show();
    }
}

const handleClose = () => {
    router.back();
}

const handleParticipate = async () => {
    const idEvent = parseInt(route.params.id as string);

    // Update participate status
    if (isParticipating.value) {
        if (await UtilsApi.removeParticipant(idEvent, user!.id) != -1) {
            isParticipating.value = false;
        }
    } else {
        if (await UtilsApi.addParticipant(idEvent, user!.id) != -1) {
            isParticipating.value = true;
        }
    }

    // Update participants list
    const participants = await UtilsApi.getAllParticipants(idEvent);
    if (event.value && participants) {
        event.value.participants = participants;
    }
}
</script>
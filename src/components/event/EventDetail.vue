<template>
    <div class="min-h-screen h-full w-screen p-[inherit]">

        <div @click="handleClose">
            <i class="bi bi-x-circle-fill text-3xl fixed top-5 right-5 text-black"></i>
        </div>

        <div class="fixed bottom-0 w-full h-20 bg-white flex p-[15px] gap-x-[15px] shadow-eventCard">
            <Button @@trigger="handleParticipate" ref="btnParticipate" class="w-full" :data="{ text: 'Participer', color: 'BLUE', type: 'PRIMARY', size: 'BASE' }" />

            <Button @@trigger="handleModal" ref="btnParticipants" class="w-max" :data="{ text: '0', color: 'BLUE', type: 'SECONDARY', size: 'BASE' }" />
        </div>

        <!-- Header -->
        <div class="h-max w-full">
            <!-- Picture -->
            <div v-if="event?.pic" :style="{ backgroundImage: 'url(http://localhost:8080/image/events/' + event.pic + ')' }" class="h-[285px] w-full bg-no-repeat bg-cover bg-center"></div>
            <div v-else class="h-[285px] w-full"></div>

            <!-- Title -->
            <div class="h-max w-full flex flex-col justify-center p-5 gap-y-[5px] bg-white border-b">
                <span class="text-[20px] font-semibold text-black">{{ event?.title }}</span>

                <span class="text-black text-[14px] font-light">
                    {{ event?.start != null && event?.city != null ? "Le " + formatDate(event.start) + " à " + event.city : "" }}
                </span>
            </div>
        </div>

        <!-- Data -->
        <div v-html="event?.description" class="h-max p-5 text-gray-500 pb-36"></div>
    </div>

    <div v-if="event?.participants">
        <ModalParticipant ref="modalParticipant" :data="event.participants"/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { IEvent } from "../../types/Event";
import { IParticipant } from "../../types/Participants";
import UtilsApi from "../../utils/UtilsApi";
import { HTTPCodes } from "../../utils/HTTPCodes";
import { useRouter } from "vue-router";
import Button from "../Button.vue";
import UtilsAuth from "../../utils/UtilsAuth";
import { IButton } from "../../types/Button";
import ModalParticipant from "../modal/ModalParticipant.vue";

const router = useRouter();
const route = useRoute();

const event = ref<IEvent>();
const nbParticipants = ref(0);

// const participants = ref<IParticipant[]>([]);

const modalParticipant = ref<InstanceType<typeof ModalParticipant> | null>(null);

const withErrors = ref(false);

const btnParticipate = ref<InstanceType<typeof Button> | null>(null);
const btnParticipants = ref<InstanceType<typeof Button> | null>(null);

const isParticipating = ref(false);

onMounted(async () => {
    const param = route.params.id;

    if (typeof param === "string") {

        const user = UtilsAuth.getCurrentUser();

        if (user === undefined) {
            router.push({ name: "login" });
            return;
        }

        const idEvent = parseInt(param);

        await UtilsApi.getEventById(idEvent).then((response) => {
            if (response.status == HTTPCodes.OK) {
                event.value = response.data.data as IEvent;

                event.value.description = event.value.description.replace(/\n/g, "<br>");

                console.log(response.data);
            }
        }).catch(() => {
            withErrors.value = true;
        });

        await UtilsApi.getAllParticipants(idEvent).then((response) => {
            if (response.status == HTTPCodes.OK && event.value) {
                event.value.participants = response.data.data as IParticipant[];

                if (event.value.participants) {
                    nbParticipants.value = event.value.participants.length;
                }

                console.log(response.data);


                btnParticipants.value?.update({ text: nbParticipants.value.toString(), color: 'BLUE', type: 'SECONDARY', size: 'BASE' });
            }
        }).catch(() => {
            withErrors.value = true;
        });

        await UtilsApi.isParticipating(user.id, idEvent).then((response) => {
            if (response.status == HTTPCodes.OK) {
                isParticipating.value = response.data.data.data as boolean;
            }
        }).catch(() => {
            withErrors.value = true;
        });

        if (withErrors.value) {
            router.push({ name: "events" });
        }
    }

    console.log(route.meta);
});

watch(isParticipating, (newValue) => {
    if (newValue) {
        btnParticipate.value?.update(updateBtnCancelParticipate);
    } else {
        btnParticipate.value?.update(updateBtnParticipate);
    }
});

const updateBtnParticipate: IButton = {
    text: "Participer",
    color: "BLUE",
    type: "PRIMARY",
    size: "BASE"
}

const updateBtnCancelParticipate: IButton = {
    text: "Annuler la participation",
    color: "RED",
    type: "SECONDARY",
    size: "BASE"
}

const updateBtnParticipants = (nb: number) => {
    btnParticipants.value?.updateText(nb.toString());
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

const handleClose = () => {
    router.push({ name: "events" });

    // TODO : Ajouter l'information de l'id de l'event dans l'url pour pouvoir revenir à l'event
}

const handleParticipate = async () => {
    const user = UtilsAuth.getCurrentUser();

    if (user === undefined) {
        router.push({ name: "login" });
        return;
    }

    const idEvent = parseInt(route.params.id as string);

    if (isParticipating.value) {
        await UtilsApi.removeParticipant(idEvent, user.id).then((response) => {
            if (response.status == HTTPCodes.OK) {
                isParticipating.value = false;

                nbParticipants.value -= 1;

                updateBtnParticipants(nbParticipants.value);
            }

            console.log(response.data);
        }).catch(() => {
            withErrors.value = true;
        });
    } else {
        await UtilsApi.addParticipant(idEvent, user.id).then((response) => {
            if (response.status == HTTPCodes.CREATED) {
                isParticipating.value = true;

                nbParticipants.value += 1;

                updateBtnParticipants(nbParticipants.value);
            }

            console.log(response.data);

        }).catch(() => {
            withErrors.value = true;
        });
    }
}

const handleModal = () => {
    modalParticipant.value?.show();
}
</script>
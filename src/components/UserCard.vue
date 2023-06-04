<template>
    <div v-if="loading && props.data.style == 'SQUARE'" class="loading h-[137px] w-full max-w-xs rounded-[18px] bg-[#FAFAFA] p-[13px] flex flex-col gap-y-[10px]">
        <div class="flex items-center justify-between w-full gap-x-2">
            <div class="rounded-full w-[60px] h-[60px] bg-white flex items-center justify-center aspect-square"></div>
        </div>

        <div class="w-2/3 h-full bg-white rounded-full"></div>

        <div class="flex items-center justify-center h-full w-full gap-x-2">
            <div class="w-full h-full bg-white rounded-full"></div>
            <div class="w-full h-full bg-white rounded-full"></div>
        </div>
    </div>

    <UserCardSquare v-if="!loading && props.data.style == 'SQUARE'" @@click="handleClick" :data="{ user: props.data.user, interests: userInterests }" :button="btnStyle" />
</template>
  
<script setup lang="ts">
import { PropType, onMounted, ref } from "vue";

import type { IUser } from "../types/User";
import type { IButton } from "../types/Button";
import type { IInterest } from "../types/Interest";

import UtilsApi from "../utils/UtilsApi";
import UtilsAuth from "../utils/UtilsAuth";

import UserCardSquare from "./UserCardSquare.vue";

// ########################################### VARIABLES ###########################################

const props = defineProps({
    data: {
        type: Object as PropType<{
            user: IUser,
            style: "SQUARE" | "RECTANGLE",
            action: "FRIEND_REQUEST" | "SHOW_PROFIL"
        }>,
        required: true,
    }
});

const user = UtilsAuth.getCurrentUser();
const isPending = ref(false);
const loading = ref(true);
const userInterests = ref<IInterest[]>([]);
const btnStyle = ref<IButton>({
    apparence: {
        color: "BLUE",
        size: "XS",
        type: "PRIMARY"
    }
});

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    // Action
    switch (props.data.action) {
        case "FRIEND_REQUEST":
            await loadFriendRequest();
            break;

        case "SHOW_PROFIL":
            loadUserProfil();
            break;
    }

    // Interests
    if (props.data.style == "SQUARE") {
        await loadInterests();
    }

    loading.value = false;
});

const loadFriendRequest = async () => {
    const friends = await UtilsApi.isFriend(user!.id, props.data.user.id);

    if (!friends) {
        isPending.value = await UtilsApi.isPending(user!.id, props.data.user.id);

        btnStyle.value = {
            apparence: {
                color: isPending.value ? "RED" : "BLUE",
                size: "XS",
                type: isPending.value ? "SECONDARY" : "PRIMARY"
            },
            text: isPending.value ? "Annuler" : "Ajouter"
        };
    }
};

const loadInterests = async () => {
    const interestsData = await UtilsApi.getUserInterests(props.data.user.id);

    if (interestsData) {
        userInterests.value = interestsData;
        userInterests.value = userInterests.value.slice(0, 2);
    }
};

const loadUserProfil = () => {
    btnStyle.value = {
        apparence: {
            color: "BLUE",
            size: "XS",
            type: "PRIMARY"
        },
        text: "Profil"
    };
};

// ########################################### HANDLERS ###########################################

const handleClick = async () => {
    switch (props.data.action) {
        case "FRIEND_REQUEST":
            if (isPending.value) { // Il existe déjà une demande d'ami
                const rejectRequest = await UtilsApi.rejectFriendRequest(user!.id, props.data.user.id);

                if (rejectRequest) {
                    btnStyle.value = {
                        apparence: {
                            color: "BLUE",
                            size: "XS",
                            type: "PRIMARY"
                        },
                        text: "Ajouter"
                    };

                    isPending.value = false;
                }
            } else { // Il n'existe pas de demande d'ami
                const askRequest = await UtilsApi.askFriend(user!.id, props.data.user.id);

                if (askRequest) {
                    btnStyle.value = {
                        apparence: {
                            color: "RED",
                            size: "XS",
                            type: "SECONDARY"
                        },
                        text: "Annuler"
                    };

                    isPending.value = true;
                }
            }
            break;

        case "SHOW_PROFIL":
            // Ajoutez ici le code pour afficher le profil de l'utilisateur
            break;
    }
};
</script>
  
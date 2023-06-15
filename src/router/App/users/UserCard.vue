<template>
    <div v-if="loading && props.data.style == 'SQUARE'" class="loading h-[137px] w-full max-w-xs rounded-[18px] bg-[#FAFAFA] p-[13px] flex flex-col gap-y-[10px]">
        <div class="flex items-center justify-between w-full gap-x-2">
            <div class="rounded-full w-[60px] h-[60px] bg-white flex items-center justify-center aspect-square"></div>
        </div>

        <div class="w-2/3 h-full bg-white rounded-full"></div>

        <div class="flex items-center justify-center w-full h-full gap-x-2">
            <div class="w-full h-full bg-white rounded-full"></div>
            <div class="w-full h-full bg-white rounded-full"></div>
        </div>
    </div>

    <UserCardSquare v-if="!hidden && !loading && props.data.style == 'SQUARE'" @@click="handleClick" :data="{ user: props.data.user, interests: interests }" :button="btnStyle" />
    <UserCardRectangle v-else-if="!hidden && !loading && props.data.style == 'RECTANGLE'" @@click="handleClick" :data="{ user: props.data.user }" :button="btnStyle" />
</template>
  
<script setup lang="ts">
import { PropType, onMounted, ref } from "vue";

import type { IUser, IButton, IInterest } from "../../../types/interfaces";

import UtilsApi from "../../../utils/UtilsApi";
import UtilsAuth from "../../../utils/UtilsAuth";

import UserCardSquare from "./UserCardSquare.vue";
import UserCardRectangle from "./UserCardRectangle.vue";
import { useRouter } from "vue-router";

// ########################################### VARIABLES ###########################################

const router    = useRouter();
const user      = UtilsAuth.getCurrentUser();
const isPending = ref(false);
const loading   = ref(true);
const interests = ref<IInterest[]>([]);
const hidden    = ref(false);

const props = defineProps({
    data: {
        type: Object as PropType<{
            user: IUser,
            style: "SQUARE" | "RECTANGLE",
            action: "FRIEND_REQUEST" | "SHOW_PROFIL" | "UNBLOCK_FRIEND"
        }>,
        required: true,
    }
});

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

        case "UNBLOCK_FRIEND":
            loadUnblockFriend();
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
        const data = await UtilsApi.isPending(user!.id, props.data.user.id);
        
        isPending.value = data.pending;

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
        interests.value = interestsData;
        interests.value = interests.value.slice(0, 2);
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

const loadUnblockFriend = () => {
    btnStyle.value = {
        apparence: {
            color: "RED",
            size: "XS",
            type: "PRIMARY"
        },
        text: "Débloquer"
    };
};

// ########################################### EVENTS ###########################################

const emit = defineEmits(["@click"]);

// ########################################### HANDLERS ###########################################

const handleClick = async () => {
    // Emit event
    emit("@click");

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
            router.push({ name: "profile", params: { id: props.data.user.id } });
            break;

        case "UNBLOCK_FRIEND":
            const unblock = await UtilsApi.removeBlockedUser(user!.id, props.data.user.id);

            if (unblock) {
                hidden.value = true;
            }
            
            break;
    }
};
</script>
  
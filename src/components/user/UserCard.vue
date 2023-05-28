<template>
    <!-- LOADING -->
    <div v-if="loading">
        <div class="loading h-[137px] w-full max-w-xs rounded-[18px] bg-[#FAFAFA] p-[13px] flex flex-col gap-y-[10px]">
            <div class="flex items-center justify-between w-full gap-x-2">
                <div class="rounded-full w-[60px] h-[60px] bg-white flex items-center justify-center aspect-square"></div>
                <Button class="w-full" ref="button" />
            </div>

            <div class="w-2/3 h-5 bg-white rounded-md"></div>

            <div class="flex items-center justify-center w-full h-5 gap-x-2">
                <div class="w-full h-full bg-white rounded-md"></div>
                <div class="w-full h-full bg-white rounded-md"></div>
            </div>
        </div>
    </div>

    <div v-else>
        <!-- FRIEND_REQUEST -->
        <div v-if="props.style.shape == EUserCardStyle.FRIEND_REQUEST" ref="container" class="h-[137px] w-full max-w-xs rounded-[18px] bg-[#FAFAFA] p-[13px] flex flex-col gap-y-[10px]">
            <!-- Picture + button -->
            <div class="flex items-center justify-between w-full gap-x-2">
                <div v-if="props.data.pic" class="bg-no-repeat rounded-full w-[60px] h-[60px] bg-center bg-cover" :style="{ backgroundImage: 'url(' + UtilsApi.getImage('users', props.data.pic) + ')' }"></div>
                <div v-else class="rounded-full w-[60px] h-[60px] bg-[#ECF3FD] flex items-center justify-center">
                    <i class="text-2xl bi bi-person-fill"></i>
                </div>
                <Button ref="button" @@trigger="handleClick" :data="buttonType" />
            </div>

            <!-- Name / Pseudo -->
            <div class="text-base font-semibold">
                <span>{{ props.data.firstname + ' ' + props.data.lastname }}</span>
            </div>

            <!-- Center of interests -->
            <div></div>
        </div>

        <!-- RECTANGLE -->
        <div v-else="props.style.shape == EUserCardStyle.FRIEND_PROFILE" class="w-full h-max flex items-center justify-between gap-x-5 bg-[#FAFAFA] p-[13px] rounded-[18px]">
            <div class="flex items-center justify-center w-max gap-x-5">
                <div v-if="props.data.pic" class="bg-no-repeat rounded-full w-[60px] h-[60px] bg-center bg-cover" :style="{ backgroundImage: 'url(' + UtilsApi.getImage('users', props.data.pic) + ')' }"></div>
                <span>{{ props.data.firstname + ' ' + props.data.lastname }}</span>
            </div>

            <Button class="w-max" :data="{ size: 'XS', color: 'BLUE', type: 'PRIMARY', text: 'Profil' }" />
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { PropType, onMounted, ref } from "vue";

import type { IUser } from "../../types/User";
import type { IButton } from "../../types/Button";
import type { IUserCardStyle } from "../../types/UserCardStyle";
import { EUserCardStyle } from "../../types/UserCardStyle";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

import Button from "../Button.vue";

// ########################################### VARIABLES ###########################################

const props = defineProps({
    data: {
        type: Object as PropType<IUser>,
        required: true,
    },
    style: {
        type: Object as PropType<IUserCardStyle>,
        required: true
    }
});

enum EActionType {
    DEFAULT,
    SEND_FRIEND_REQUEST,
    REMOVE_FRIEND_REQUEST,
    SHOW_PROFIL,
}

interface IInteractableButton {
    DEFAULT: IButton;
    SHOW_USER_PROFIL: IButton;
    ASK_FRIEND: IButton;
    REMOVE_FRIEND_REQUEST: IButton;
}

const styles: IInteractableButton = {
    DEFAULT: { color: "BLUE", size: "XS", type: "PRIMARY", text: "" },
    SHOW_USER_PROFIL: { color: "BLUE", size: "XS", type: "PRIMARY", text: "Profil" },
    ASK_FRIEND: { color: "BLUE", size: "XS", type: "PRIMARY", text: "Ajouter" },
    REMOVE_FRIEND_REQUEST: { color: "RED", size: "XS", type: "SECONDARY", text: "Annuler" },
};

const user = UtilsAuth.getCurrentUser();

const actionType = ref<EActionType>(EActionType.DEFAULT);
const buttonType = ref<IButton>(styles.DEFAULT);

const container = ref<HTMLElement | null>(null);
const button = ref<InstanceType<typeof Button>>();

const isFriend = ref(false);
const isPending = ref(false);

const loading = ref(true);

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    switch (props.style.shape) {
        case EUserCardStyle.FRIEND_REQUEST:
            isFriend.value = await UtilsApi.isFriend(user!.id, props.data.id);

            if (!isFriend.value) {
                isPending.value = await UtilsApi.isPending(user!.id, props.data.id);

                if (isPending.value) {
                    buttonType.value = styles.REMOVE_FRIEND_REQUEST;
                    actionType.value = EActionType.REMOVE_FRIEND_REQUEST;
                    button.value?.update(styles.REMOVE_FRIEND_REQUEST);
                } else {
                    buttonType.value = styles.ASK_FRIEND;
                    actionType.value = EActionType.SEND_FRIEND_REQUEST;
                    button.value?.update(styles.ASK_FRIEND);
                }
            }
            break;

        case EUserCardStyle.FRIEND_PROFILE:
    }

    loading.value = false;
});

// ########################################### HANDLERS ###########################################

const handleClick = async () => {
    switch (actionType.value) {
        case EActionType.SEND_FRIEND_REQUEST:
            if (isPending.value) return;

            // Demande d'ami
            const askRequest = await UtilsApi.askFriend(user!.id, props.data.id);
            if (askRequest) {
                if (button.value && styles.REMOVE_FRIEND_REQUEST) {
                    // button.value.updateText(styles.REMOVE_FRIEND_REQUEST.text);
                    // button.value.updateState(styles.REMOVE_FRIEND_REQUEST);
                    button.value.update(styles.REMOVE_FRIEND_REQUEST);
                    isPending.value = true;
                    actionType.value = EActionType.REMOVE_FRIEND_REQUEST;
                }
            }
            break;

        case EActionType.REMOVE_FRIEND_REQUEST:
            if (!isPending.value) return;

            // Annulation de la demande d'ami
            const rejectRequest = await UtilsApi.rejectFriendRequest(user!.id, props.data.id);

            if (rejectRequest) {
                if (button.value && styles.ASK_FRIEND) {
                    // button.value.updateText(styles.ASK_FRIEND.text);
                    // button.value.updateState(styles.ASK_FRIEND);
                    button.value.update(styles.ASK_FRIEND);
                    isPending.value = false;
                    actionType.value = EActionType.SEND_FRIEND_REQUEST;
                }
            }

            break;
        case EActionType.SHOW_PROFIL:
            // Ajoutez ici le code pour afficher le profil de l'utilisateur
            break;
    }
};
</script>
  
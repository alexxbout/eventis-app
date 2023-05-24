<template>
    <div ref="container" class="h-[137px] w-full max-w-xs rounded-[13px] bg-[#FAFAFA] p-[13px] flex flex-col gap-y-[10px]">
        <!-- Picture + button -->
        <div class="flex items-center justify-between w-full gap-x-2">
            <div v-if="props.data.pic" class="bg-no-repeat rounded-full w-[60px] h-[60px] bg-center bg-cover" :style="{ backgroundImage: 'url(http://localhost:8080/image/users/' + props.data.pic + ')' }"></div>
            <div v-else class="rounded-full w-[60px] h-[60px] bg-[#ECF3FD] flex items-center justify-center">
                <i class="text-2xl bi bi-person-fill"></i>
            </div>
            <Button ref="button" @click="handleClick" :data="buttonType" />
        </div>

        <!-- Name / Pseudo -->
        <div class="font-bold text-[14px]">
            <span>{{ props.data.firstname + ' ' + props.data.lastname }}</span>
        </div>

        <!-- Interets -->
        <div></div>
    </div>
</template>
  
<script setup lang="ts">
import Button from "../Button.vue";
import { onMounted, ref } from "vue";
import type { IUser } from "../../types/User";
import type { IButton } from "../../types/Button";
import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

const props = defineProps({
    data: {
        type: Object as () => IUser,
        required: true,
    },
    hideFriends: {
        type: Boolean,
        default: false,
    },
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

const actionType = ref<EActionType>(EActionType.DEFAULT);
const buttonType = ref<IButton>(styles.DEFAULT);

const container = ref<HTMLElement | null>(null);
const button = ref<InstanceType<typeof Button>>();

const isFriend = ref(false);
const isPending = ref(false);

onMounted(async () => {
    const user = UtilsAuth.getCurrentUser();

    if (user) {
        await UtilsApi.isFriend(user.id, props.data.id).then((response) => {
            if (response.status === 200) {
                isFriend.value = response.data.data.data === true;
            }
        });

        if (props.hideFriends && isFriend.value && container.value) {
            container.value.classList.add("hidden");
        } else if (isFriend.value) {
            await UtilsApi.isPending(user.id, props.data.id).then((response) => {
                if (response.status === 200) {
                    isPending.value = response.data.data === "true";
                }
            });

            if (isPending.value) {
                buttonType.value = styles.REMOVE_FRIEND_REQUEST;
                actionType.value = EActionType.REMOVE_FRIEND_REQUEST;

                button.value?.update(styles.REMOVE_FRIEND_REQUEST);
            } else {
                buttonType.value = styles.SHOW_USER_PROFIL;
                actionType.value = EActionType.SHOW_PROFIL;
                button.value?.update(styles.SHOW_USER_PROFIL);
            }
        } else {
            buttonType.value = styles.ASK_FRIEND;
            actionType.value = EActionType.SEND_FRIEND_REQUEST;
            button.value?.update(styles.ASK_FRIEND);
        }
    }
});

const handleClick = () => {
    const user = UtilsAuth.getCurrentUser();

    if (!user) {
        return;
    }

    switch (actionType.value) {
        case EActionType.SEND_FRIEND_REQUEST:
            if (isPending.value) {
                return;
            }
            // Demande d'ami
            UtilsApi.askFriend(user.id, props.data.id)
                .then((response) => {
                    if (response.status === 201) {
                        if (button.value && styles.REMOVE_FRIEND_REQUEST) {
                            // button.value.updateText(styles.REMOVE_FRIEND_REQUEST.text);
                            // button.value.updateState(styles.REMOVE_FRIEND_REQUEST);
                            button.value.update(styles.REMOVE_FRIEND_REQUEST);
                            isPending.value = true;
                            actionType.value = EActionType.REMOVE_FRIEND_REQUEST;
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            break;

        case EActionType.REMOVE_FRIEND_REQUEST:
            if (!isPending.value) {
                return;
            }

            // Annulation de la demande d'ami
            UtilsApi.rejectFriendRequest(user.id, props.data.id)
                .then((response) => {
                    if (response.status === 200) {
                        if (button.value && styles.ASK_FRIEND) {
                            // button.value.updateText(styles.ASK_FRIEND.text);
                            // button.value.updateState(styles.ASK_FRIEND);
                            button.value.update(styles.ASK_FRIEND);
                            isPending.value = false;
                            actionType.value = EActionType.SEND_FRIEND_REQUEST;
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            break;
        case EActionType.SHOW_PROFIL:
            // Ajoutez ici le code pour afficher le profil de l'utilisateur
            break;
    }
};
</script>
  
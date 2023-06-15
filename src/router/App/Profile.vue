<template>
    <div v-if="targetUser" class="flex flex-col mb-20 gap-y-6 margins">

        <!-- Header -->
        <div class="flex items-center w-full">
            <div class="flex gap-x-[15px] items-center justify-between w-max">
                <i v-show="!isCurrentUser" @click="router.back()" class="bi bi-arrow-left-short back"></i>

                <span class="header">Profil</span>
            </div>
        </div>

        <!-- Picture + fullname + settings -->
        <div v-show="!isLoading" class="flex items-center gap-x-5 w-full bg-[#FAFAFA] rounded-[30px] p-5">
            <UserProfilPicture :data="{ pic: targetUser.pic, style: 'LARGE' }" />

            <div class="flex flex-col gap-y-5 w-full">
                <div class="flex flex-col gap-y-0">
                    <div v-if="targetUser.showPseudo == '1'" class="flex gap-x-2 items-center">
                        <Emoji v-if="targetUser.emoji != null" :data="{ name: targetUser.emoji, size: 'PROFILE' }" />
                        <span class="text-2xl font-medium">{{ targetUser.pseudo }}</span>
                    </div>
                    <span v-show="targetUser.showPseudo == '0'" class="text-2xl font-medium">{{ targetUser.firstname + ' ' + targetUser.lastname }}</span>
                </div>

                <!-- Settings -->
                <Button v-if="isCurrentUser" @@click="router.push({ name: 'settings' })" :data="btnProfileStyle" class="w-max" />

                <!-- Manage friend incomming friend request -->
                <div v-if="isRequested" class="flex items-center justify-center gap-x-3 w-full">
                    <Button @@click="handleAcceptRequest" :data="buttonsRequestedStyle[0]" class="w-full"></Button>
                    <Button @@click="handleRejectRequest" :data="buttonsRequestedStyle[1]" class="w-full"></Button>
                </div>

                <!-- Manage friendship -->
                <Button v-else-if="!isCurrentUser" @@click="handleFriendButton" :data="btnFriendStyle" class="w-max" />
            </div>
        </div>

        <div v-show="isLoading" class="flex items-center gap-x-5 w-full h-full rounded-[30px] p-5 loading">
            <div class="w-[90px] h-[90px] aspect-square rounded-full bg-white"></div>
        </div>

        <!-- Bio -->
        <div v-show="!isLoading" class="flex flex-col gap-y-3 bg-[#FAFAFA] rounded-[30px] p-5">
            <span class="text-xl font-medium">Bio</span>
            <span class="text-base text-gray-400 whitespace-pre-wrap">{{ targetUser.bio }}</span>
        </div>

        <div v-show="isLoading" class="flex flex-col gap-y-3 rounded-[30px] p-5 loading">
            <div class="h-5 w-4/5 bg-white rounded-lg"></div>
            <div class="h-5 w-2/3 bg-white rounded-lg"></div>
            <div class="h-5 w-1/3 bg-white rounded-lg"></div>
        </div>

        <!-- Friends -->
        <div v-if="isCurrentUser" v-show="!isLoading" class="flex flex-col gap-y-3 bg-[#FAFAFA] rounded-[30px] p-5">
            <span class="text-xl font-medium">Amis</span>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center justify-center w-max">
                    <UserProfilPicture class="-mx-2" v-for="friend in friends" :data="{ pic: friend?.pic, style: 'SMALL' }" />
                </div>

                <Button @@click="router.push({ name: 'friends' })" :data="{ apparence: { color: 'BLUE', size: 'XS', type: 'SECONDARY', rounded: 'FULL' }, text: 'Voir plus' }" />
            </div>
        </div>

        <div v-if="isCurrentUser" v-show="isLoading" class="flex gap-y-3 gap-x-1 rounded-[30px] p-5 loading">
            <div class="rounded-full bg-white h-[45px] w-[45px] aspect-square"></div>
            <div class="rounded-full bg-white h-[45px] w-[45px] aspect-square"></div>
            <div class="rounded-full bg-white h-[45px] w-[45px] aspect-square"></div>
            <div class="rounded-full bg-white h-[45px] w-[45px] aspect-square"></div>
        </div>

        <!-- Interests -->
        <div v-show="!isLoading" class="flex flex-col gap-y-3 bg-[#FAFAFA] rounded-[30px] p-5">
            <span class="text-xl font-medium">Centres d’intérêts</span>
            <div style="grid-auto-columns: 1fr;" class="grid w-full grid-flow-col gap-x-3">
                <InterestCardProfil v-for="interest in interests" :data="interest" />
            </div>
        </div>

        <div v-show="isLoading" class="flex gap-x-3 rounded-[30px] p-5 loading">
            <div class="rounded-xl bg-white h-[80px] w-1/3 aspect-square"></div>
            <div class="rounded-xl bg-white h-[80px] w-1/3 aspect-square"></div>
            <div class="rounded-xl bg-white h-[80px] w-1/3 aspect-square"></div>
        </div>
    </div>

    <Modal ref="modal" :data="{ header: { title: 'Gestion de l\'amitié', closeButton: true } }">
        <Button @@click="handleBlock" :data="{ apparence: { color: 'RED', size: 'BASE', type: 'PRIMARY' }, text: 'Bloquer' }"></Button>
        <Button @@click="handleRemoveFriend" :data="{ apparence: { color: 'RED', size: 'BASE', type: 'SECONDARY' }, text: 'Retirer' }"></Button>
    </Modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import Button from "../../components/Button.vue";
import UserProfilPicture from "./users/UserProfilPicture.vue";
import InterestCardProfil from "../../components/InterestCardProfil.vue";

import type { IInterest, IUser, IButton, IPending } from "../../types/interfaces";

import UtilsAuth from "../../utils/UtilsAuth";
import UtilsApi from "../../utils/UtilsApi";
import { useRouter } from "vue-router";
import { RouteLocationNormalizedLoaded } from "vue-router";
import Emoji from "../../components/Emoji.vue";
import Modal from "../../components/Modal.vue";

// ########################################### VARIABLES ###########################################

const MAX_FRIENDS = 5;
const MAX_INTERESTS = 3;

const ERROR_LEVEL = import.meta.env.VITE_ERROR_LEVEL;

const targetUser = ref<IUser | null>(null);
const user = ref<IUser>(UtilsAuth.getCurrentUser()!);
const route = useRoute();
const router = useRouter();
const friends = ref<IUser[]>([]);
const interests = ref<IInterest[]>([]);
const isCurrentUser = ref(false);
const isFriend = ref(false);
const isPending = ref<IPending>({ pending: false, value: null });
const isRequester = computed(() => isPending.value.value?.idRequester == user.value.id);
const isRequested = computed(() => isPending.value.value?.idRequested == user.value.id);
const isLoading = ref(true);
const isBlocked = ref(false);
const modal = ref<InstanceType<typeof Modal> | null>(null);

const btnProfileStyle = ref<IButton>(
    {
        apparence: {
            color: "BLUE",
            size: "XS",
            type: "SECONDARY",
            rounded: "FULL"
        },
        text: "Paramètres du compte"
    });

const btnFriendStyle = computed<IButton>(() => {
    return {
        apparence: {
            color: isFriend.value ? "GRAY" : "BLUE",
            type: isFriend.value ? "SECONDARY" : (isPending.value.pending && isRequester ? "SECONDARY" : "PRIMARY"),
            size: "XS",
            rounded: "FULL"
        },
        text: isFriend.value ? "Gérer amitié" : (isPending.value.pending && isRequester ? "Retirer demande" : "Demander en ami"),
    };
});

const buttonsRequestedStyle = ref<IButton[]>([
    {
        apparence: {
            color: "GREEN",
            type: "PRIMARY",
            size: "XS"
        },
        text: "Oui"
    },
    {
        apparence: {
            color: "RED",
            type: "PRIMARY",
            size: "XS"
        },
        text: "Non"
    }
]);

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    await router.isReady();

    router.beforeEach(async (to, from, next) => {
        next();

        if (to.name === from.name) {
            isLoading.value = true;

            await updateComponent(getUserId(to));

            isLoading.value = false;
        }
    });

    await updateComponent(getUserId(route));

    isLoading.value = false;

    console.log(isPending.value);

});

const getUserId = (route: RouteLocationNormalizedLoaded) => {
    const param = parseInt(route.params.id as string);
    const idUser = param ? param : user.value.id;

    return idUser;
};

const updateComponent = async (idUser: number) => {
    await updateUserData(idUser);
    await updateBlockedStatus();

    if (!isBlocked.value) {
        await updateFriends();
        await updateInterests();

        await updateFriendship();
    } else {
        router.push({ name: "notfound" });
    }
};

const updateUserData = async (idUser: number) => {
    if (user.value.id == idUser) {
        isCurrentUser.value = true;

        targetUser.value = user.value;
    } else {
        const dataUser = await UtilsApi.getUserById(idUser);

        if (dataUser) {
            isCurrentUser.value = false;

            targetUser.value = dataUser;
        } else {
            isCurrentUser.value = true;

            targetUser.value = user.value;
        }
    }
};

const updateBlockedStatus = async () => {
    if (!isCurrentUser.value && targetUser.value) {
        const idUser1 = user.value.id;
        const idUser2 = targetUser.value.id;

        if (idUser1 != idUser2) {
            isBlocked.value = await UtilsApi.isBlocked(idUser1, idUser2);
        }
    }
};

const updateFriends = async () => {
    // Update friends only if the user is the current user
    if (isCurrentUser.value) {
        const dataFriends = await UtilsApi.getAllFriends(user.value.id);

        if (dataFriends) {
            friends.value = dataFriends.slice(0, MAX_FRIENDS);
        }
    }
};

const updateInterests = async () => {
    if (targetUser.value) {
        const dataInterests = await UtilsApi.getUserInterests(targetUser.value.id);

        if (dataInterests) {
            interests.value = dataInterests;

            interests.value = interests.value.slice(0, MAX_INTERESTS);
        }
    }
};

const updateFriendship = async () => {
    if (!isCurrentUser.value && targetUser.value) {
        const idUser1 = user.value.id;
        const idUser2 = targetUser.value.id;

        if (idUser1 != idUser2) {
            // Update friendship status
            isFriend.value = await UtilsApi.isFriend(idUser1, idUser2);

            if (!isFriend.value) {
                // If they are not friends, check if there is a pending request
                isPending.value = await UtilsApi.isPending(idUser1, idUser2);
            }
        } else if (ERROR_LEVEL > 0) {
            console.log("DEBUG : Unable to check if user is friend with himself");
        }
    }
};

// ########################################### HANDLES ###########################################

const handleFriendButton = async () => {
    // TODO: Handle friend button

    // Already friend
    // - Show modal to manage friendship
    // Not friend and no pending request
    // - Send friend request
    // Not friend and pending request
    // - Remove pending request

    if (isFriend.value) {
        modal.value?.show();
    } else {
        if (isPending.value.pending) {
            // Remove pending request
            if (await UtilsApi.rejectFriendRequest(user.value.id, targetUser.value!.id)) {
                isPending.value = await UtilsApi.isPending(user.value.id, targetUser.value!.id);
            } else if (ERROR_LEVEL > 0) {
                console.log("DEBUG : Unable to remove pending request");
            }
        } else {
            // Send friend request
            if (await UtilsApi.askFriend(user.value.id, targetUser.value!.id)) {
                isPending.value = await UtilsApi.isPending(user.value.id, targetUser.value!.id);
            } else if (ERROR_LEVEL > 0) {
                console.log("DEBUG : Unable to send friend request");
            }
        }
    }
};

const handleBlock = async () => {
    const success = await UtilsApi.addBlockedUser(user.value.id, targetUser.value!.id);

    if (success) {
        isBlocked.value = true;

        router.back();
    }
};

const handleRemoveFriend = async () => {
    const success = await UtilsApi.removeFriendship(user.value.id, targetUser.value!.id);

    if (success) {
        isFriend.value = false;

        modal.value?.hide();
    }
};

const handleAcceptRequest = async () => {
    if (await UtilsApi.acceptFriendRequest(user.value.id, targetUser.value!.id)) {
        isFriend.value = true;

        isPending.value = { pending: false, value: null };
    } else if (ERROR_LEVEL > 0) {
        console.log("DEBUG : Unable to accept friend request");
    }
};

const handleRejectRequest = async () => {
    if (await UtilsApi.rejectFriendRequest(user.value.id, targetUser.value!.id)) {
        isPending.value = await UtilsApi.isPending(user.value.id, targetUser.value!.id);
    } else if (ERROR_LEVEL > 0) {
        console.log("DEBUG : Unable to reject friend request");
    }
};

</script>
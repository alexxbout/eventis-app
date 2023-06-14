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

            <div class="flex flex-col gap-y-5">
                <div class="flex flex-col gap-y-0">
                    <div v-if="targetUser.showPseudo == '1'" class="flex gap-x-2 items-center">
                        <Emoji v-if="targetUser.emoji != null" :data="{ name: targetUser.emoji, size: 'PROFILE' }" />
                        <span class="text-2xl font-medium">{{ targetUser.pseudo }}</span>
                    </div>
                    <span v-show="targetUser.showPseudo == '0'" class="text-2xl font-medium">{{ targetUser.firstname + ' ' + targetUser.lastname }}</span>
                </div>

                <Button v-if="isCurrentUser" @@click="router.push({ name: 'settings' })" :data="btnProfileStyle" />
                <Button v-else @@click="handleFriendButton" :data="btnFriendStyle" />
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
        <!-- <Button @@click="handleRemoveFriend" :data="{ apparence: { color: 'RED', size: 'BASE', type: 'SECONDARY' }, text: 'Retirer' }"></Button> -->
    </Modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import Button from "../../components/Button.vue";
import UserProfilPicture from "../../components/UserProfilPicture.vue";
import InterestCardProfil from "../../components/InterestCardProfil.vue";

import type { IInterest, IUser, IButton } from "../../types/interfaces";

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

const targetUser    = ref<IUser | null>(null);
const user          = ref<IUser>(UtilsAuth.getCurrentUser()!);
const route         = useRoute();
const router        = useRouter();
const friends       = ref<IUser[]>([]);
const interests     = ref<IInterest[]>([]);
const isCurrentUser = ref(false);
const isFriend      = ref(false);
const isPending     = ref(false);
const isLoading     = ref(true);
const isBlocked     = ref(false);
const modal         = ref<InstanceType<typeof Modal> | null>(null);

const btnProfileStyle = ref<IButton>({ apparence: { color: "BLUE", size: "XS", type: "SECONDARY", rounded: "FULL" }, text: "Paramètres du compte" });

const btnFriendStyle = computed<IButton>(() => {
    return {
        apparence: {
            color: isFriend.value ? "GRAY" : "BLUE",
            type: isFriend.value ? "SECONDARY" : (isPending.value ? "SECONDARY" : "PRIMARY"),
            size: "XS",
            rounded: "FULL"
        },
        text: isFriend.value ? "Gérer amitié" : (isPending.value ? "Retirer demande" : "Demander en ami"),
    };
});

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
        await updateFriendsStatus();
        await updateInterests();

        await updateBtnStyles();
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

            // user.value = dataUser;
            targetUser.value = dataUser;
        } else {
            isCurrentUser.value = true;

            // user.value = UtilsAuth.getCurrentUser()!;
            targetUser.value = user.value;
        }
    }
};

const updateBlockedStatus = async () => {
    if (!isCurrentUser.value && targetUser.value) {
        const idUser1 = user.value.id;
        // const idUser2 = user.value.id;
        const idUser2 = targetUser.value.id;

        if (idUser1 != idUser2) {
            isBlocked.value = await UtilsApi.isBlocked(idUser1, idUser2);
        }
    }
};

const updateFriendsStatus = async () => {
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

const updateBtnStyles = async () => {
    if (!isCurrentUser.value && targetUser.value) {

        const idUser1 = user.value.id;
        const idUser2 = targetUser.value.id;

        if (idUser1 != idUser2) {
            isFriend.value = await UtilsApi.isFriend(idUser1, idUser2);
        } else if (ERROR_LEVEL > 0) {
            console.log("DEBUG : Unable to check if user is friend with himself");
        }
    }
};

// ########################################### HANDLES ###########################################

const handleFriendButton = () => {
    // TODO: Handle friend button

    // Already friend
    // Not friend and no pending request
    // Not friend and pending request

    if (isFriend.value) {
        modal.value?.show();
    }
};

const handleBlock = async () => {
    if (targetUser.value) {
        const success = await UtilsApi.addBlockedUser(user.value.id, targetUser.value.id);

        if (success) {
            isBlocked.value = true;

            router.back();
        }
    }
};

</script>
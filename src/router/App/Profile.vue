<template>
    <div class="flex flex-col mb-20 gap-y-6 margins">

        <!-- Header -->
        <div class="flex items-center w-full">
            <div class="flex gap-x-[15px] items-center justify-between w-max">
                <!-- <i class="text-[27px] bi bi-person-circle"></i> -->
                <span class="header">Profil</span>
            </div>
        </div>

        <!-- Picture + fullname + settings -->
        <div v-show="!isLoading" class="flex items-center gap-x-5 w-full bg-[#FAFAFA] rounded-[30px] p-5">
            <UserProfilPicture :data="{ pic: user.pic, style: 'LARGE' }" />

            <div class="flex flex-col gap-y-5">
                <div class="flex flex-col gap-y-0">
                    <div v-if="user.showPseudo == '1'" class="flex gap-x-2 items-center">
                        <Emoji v-if="user.emoji != null" :data="{ name: user.emoji, size: 'PROFILE' }" />
                        <span class="text-2xl font-medium">{{ user.pseudo }}</span>
                    </div>
                    <span v-show="user.showPseudo == '0'" class="text-2xl font-medium">{{ user.firstname + ' ' + user.lastname }}</span>
                </div>

                <Button v-if="isCurrentUser" @@click="router.push({ name: 'settings' })" :data="btnProfileStyle" />
                <Button v-else class="w-max" :data="btnFriendStyle" />
            </div>
        </div>

        <div v-show="isLoading" class="flex items-center gap-x-5 w-full h-full rounded-[30px] p-5 loading">
            <div class="w-[90px] h-[90px] aspect-square rounded-full bg-white"></div>
        </div>

        <!-- Bio -->
        <div v-show="!isLoading" class="flex flex-col gap-y-3 bg-[#FAFAFA] rounded-[30px] p-5">
            <span class="text-xl font-medium">Bio</span>
            <span class="text-base text-gray-400 whitespace-pre-wrap">{{ user.bio }}</span>
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

                <Button :data="{ apparence: { color: 'BLUE', size: 'XS', type: 'SECONDARY', rounded: 'FULL' }, text: 'Voir plus' }" />
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

// ########################################### VARIABLES ###########################################

const MAX_FRIENDS = 5;
const MAX_INTERESTS = 3;

const user          = ref<IUser>(UtilsAuth.getCurrentUser()!);
const route         = useRoute();
const router        = useRouter();
const friends       = ref<IUser[]>([]);
const interests     = ref<IInterest[]>([]);
const isCurrentUser = ref(false);
const isFriend      = ref(false);
const isPending     = ref(false);
const isLoading     = ref(true);

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
    user.value = UtilsAuth.getCurrentUser()!;

    await updateUser(idUser);
    await updateFriends();
    await updateInterests();

    await updateBtnStyles();
};

const updateUser = async (idUser: number) => {
    // Load user
    if (user.value.id == idUser) {
        isCurrentUser.value = true;
    } else {
        const dataUser = await UtilsApi.getUserById(idUser);

        if (dataUser) {
            isCurrentUser.value = false;

            user.value = dataUser;
        } else {
            isCurrentUser.value = true;

            user.value = UtilsAuth.getCurrentUser()!;
        }
    }
};

const updateFriends = async () => {
    if (isCurrentUser.value) {
        const dataFriends = await UtilsApi.getAllFriends(user.value.id);

        if (dataFriends) {
            friends.value = dataFriends.slice(0, MAX_FRIENDS);
        }
    }
}

const updateInterests = async () => {
    const dataInterests = await UtilsApi.getUserInterests(user.value.id);

    if (dataInterests) {
        interests.value = dataInterests;

        interests.value = interests.value.slice(0, MAX_INTERESTS);
    }
}

const updateBtnStyles = async () => {
    if (!isCurrentUser.value) {

        const idUser1 = UtilsAuth.getCurrentUser()!.id;
        const idUser2 = user.value.id;

        if (idUser1 != idUser2) {
            isFriend.value = await UtilsApi.isFriend(idUser1, idUser2);
        } else {
            console.error("Unable to check if user is friend with himself");
        }
    }
}
</script>
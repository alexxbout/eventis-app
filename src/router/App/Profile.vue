<template>
    <div class="relative flex flex-col mb-20 gap-y-6 margins">

        <!-- Header -->
        <div class="flex items-center w-full">
            <div class="flex gap-x-[15px] items-center justify-between w-max">
                <i class="text-3xl bi bi-person-circle"></i>
                <span class="header">Profil</span>
            </div>
        </div>

        <!-- Picture + fullname + settings -->
        <div class="flex items-center gap-x-5 w-full bg-[#FAFAFA] rounded-[30px] p-5">
            <UserProfilPicture :data="{ pic: user?.pic, style: 'LARGE' }" />

            <div class="flex flex-col text-2xl font-medium gap-y-5">
                <span>{{ user?.firstname + ' ' + user?.lastname }}</span>

                <Button v-if="isCurrentUser" :data="btnProfileStyle" />
                <Button v-else class="w-max" :data="btnFriendStyle" />
            </div>
        </div>

        <!-- Bio -->
        <div class="flex flex-col gap-y-3 bg-[#FAFAFA] rounded-[30px] p-5">
            <span class="text-xl font-medium">Bio</span>
            <span class="text-base text-gray-400">{{ user?.bio }}</span>
        </div>

        <!-- Friends -->
        <div v-if="isCurrentUser" class="flex flex-col gap-y-3 bg-[#FAFAFA] rounded-[30px] p-5">
            <span class="text-xl font-medium">Amis</span>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center justify-center w-max">
                    <UserProfilPicture class="-mx-2" v-for="friend in friends" :data="{ pic: friend?.pic, style: 'SMALL' }" />
                </div>

                <Button :data="{ apparence: { color: 'BLUE', size: 'XS', type: 'SECONDARY', rounded: 'FULL' }, text: 'Voir plus' }" />
            </div>
        </div>

        <!-- Interests -->
        <div class="flex flex-col gap-y-3 bg-[#FAFAFA] rounded-[30px] p-5">
            <span class="text-xl font-medium">Centres d’intérêts</span>
            <div style="grid-auto-columns: 1fr;" class="grid w-full grid-flow-col gap-x-3">
                <InterestCardProfil v-for="interest in interests" :data="interest" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import Button from "../../components/Button.vue";
import UserProfilPicture from "../../components/UserProfilPicture.vue";
import InterestCardProfil from "../../components/InterestCardProfil.vue";

import type { IInterest } from "../../types/Interest";
import type { IUser } from "../../types/User";
import type { IButton } from "../../types/Button";

import UtilsAuth from "../../utils/UtilsAuth";
import UtilsApi from "../../utils/UtilsApi";
import { useRouter } from "vue-router";
import { RouteLocationNormalizedLoaded } from "vue-router";

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
        await updateComponent(getUserId(to));

        next();
    });

    await updateComponent(getUserId(route));
});

const getUserId = (route: RouteLocationNormalizedLoaded) => {
    const param = parseInt(route.params.id as string);
    const idUser = param ? param : user.value.id;

    return idUser;
};

const updateComponent = async (idUser: number) => {
    // Load current user by default
    user.value = UtilsAuth.getCurrentUser()!;

    await updateUser(idUser);
    await updateFriends();
    await updateInterests();
    
    await updateBtnStyles();
};

const updateUser = async (idUser: number) => {
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
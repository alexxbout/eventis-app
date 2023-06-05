<template>
    <div class="relative flex flex-col mb-20 gap-y-16 margins">

        <!-- Header -->
        <div class="flex items-center w-full">
            <div class="flex gap-x-[15px] items-center justify-between w-max">
                <i class="text-3xl bi bi-person-circle"></i>
                <span class="header">Profil</span>
            </div>
        </div>

        <!-- Picture + fullname + settings -->
        <div v-if="isCurrentUser" class="flex items-center justify-center gap-x-5 w-max">
            <UserProfilPicture :data="{ pic: user?.pic, style: 'LARGE' }" />

            <div class="flex flex-col text-3xl font-medium gap-y-5">
                <span>{{ user?.firstname + ' ' + user?.lastname }}</span>

                <Button :data="{ apparence: { color: 'BLUE', size: 'XS', type: 'SECONDARY', rounded: 'FULL' }, text: 'Paramètres du compte' }" />
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center w-full gap-y-5">
            <UserProfilPicture :data="{ pic: user?.pic, style: 'BIG' }" />

            <div class="flex flex-col items-center justify-center text-3xl font-medium h-max w-max gap-y-5">
                <span>{{ user?.firstname + ' ' + user?.lastname }}</span>

                <Button :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'SECONDARY', rounded: 'FULL' }, text: 'TEMP' }" />
            </div>
        </div>

        <!-- Bio -->
        <div class="flex flex-col gap-y-3">
            <span class="text-xl font-medium">Bio</span>
            <span class="text-base text-gray-400">{{ user?.bio }}</span>
        </div>

        <!-- Friends -->
        <div v-if="isCurrentUser" class="flex flex-col gap-y-3">
            <span class="text-xl font-medium">Amis</span>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center justify-center w-max">
                    <UserProfilPicture class="-mx-2" v-for="friend in friends" :data="{ pic: friend?.pic, style: 'SMALL' }" />
                </div>

                <Button :data="{ apparence: { color: 'BLUE', size: 'XS', type: 'SECONDARY', rounded: 'FULL' }, text: 'Voir plus' }" />
            </div>
        </div>

        <!-- Interests -->
        <div class="flex flex-col gap-y-3">
            <span class="text-xl font-medium">Centres d’intérêts</span>
            <div style="grid-auto-columns: 1fr;" class="grid w-full grid-flow-col gap-x-3">
                <InterestCardProfil v-for="interest in interests" :data="interest" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import Button from "../../components/Button.vue";
import UserProfilPicture from "../../components/UserProfilPicture.vue";
import InterestCardProfil from "../../components/InterestCardProfil.vue";

import type { IInterest } from "../../types/Interest";
import type { IUser } from "../../types/User";

import UtilsAuth from "../../utils/UtilsAuth";
import UtilsApi from "../../utils/UtilsApi";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const MAX_FRIENDS = 5;
const MAX_INTERESTS = 3;
const user = ref<IUser>(UtilsAuth.getCurrentUser()!);
const router = useRouter();
const route = useRoute();

const friends = ref<IUser[]>([]);
const interests = ref<IInterest[]>([]);

const isCurrentUser = ref(false);

onMounted(async () => {
    // Check if current id is the same as the user id
    const param = parseInt(route.params.id as string);

    if (user.value.id == param || !param) {
        isCurrentUser.value = true;
    } else {
        isCurrentUser.value = false;

        // Get user
        const dataUser = await UtilsApi.getUserById(param);

        if (dataUser) {
            user.value = dataUser;
        } else {
            router.push({ name: "profile" });
            return;
        }
    }

    // Get all friends
    if (isCurrentUser.value) {
        const dataFriends = await UtilsApi.getAllFriends(user.value.id);

        if (dataFriends) {
            friends.value = dataFriends.slice(0, MAX_FRIENDS);
        }
    }

    // Get all interests
    const dataInterests = await UtilsApi.getUserInterests(user.value.id);

    if (dataInterests) {
        interests.value = dataInterests;

        interests.value = interests.value.slice(0, MAX_INTERESTS);
    }
});
</script>



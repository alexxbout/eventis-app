<template>
    <div class="flex flex-col justify-around w-full h-full">
        <!-- Retour -->
        <div class="flex items-center w-full">
            <i @click.prevent="props.previous()" class="bi bi-arrow-left-short bg-[#F2F2F7] text-center flex items-center justify-center text-3xl text-[#3C3C43]/60 w-12 h-12 aspect-square rounded-full"></i>
        </div>

        <!-- Friends -->
        <div class="flex flex-col h-4/6 gap-y-14">
            <span class="header">Restez connectés avec vos amis</span>

            <!-- UserCard -->
            <div class="grid w-full gap-3 overflow-hidden overflow-y-auto h-max 2xs:grid-cols-1 xs:grid-cols-2">
                <UserCard v-for="user in users" :data="{ user: user, style: 'SQUARE', action: 'FRIEND_REQUEST' }" />
            </div>
        </div>

        <!-- Suivant -->
        <Button @@click="props.next()" :data="nextBtnStyle" />
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";

import UserCard from "../app/users/UserCard.vue";
import Button from "../../components/Button.vue";

import type { IUser, IRegistration, IButton } from "../../types/interfaces";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ############################################## VARIABLES ##############################################

const props   = inject("props") as IRegistration;
const users   = ref<IUser[]>([]);
const loading = ref(true);

const nextBtnStyle = ref<IButton>({
    apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY' },
    text: 'Suivant',
    icon: { name: 'ARROW_RIGHT', side: 'RIGHT' },
});

// ############################################## FUNCTIONS ##############################################

onMounted(async () => {
    const user = UtilsAuth.getCurrentUser();

    if (user) {
        const idUser = user.id;

        const request = await UtilsApi.getAffinities(idUser);

        if (request) {
            users.value = request;

            loading.value = false;
        }
    }
});

</script>
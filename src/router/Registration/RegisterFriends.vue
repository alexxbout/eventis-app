<template>
    <div class="flex flex-col justify-around w-full h-full">
        <!-- Retour -->
        <div class="flex items-center w-full">
            <div @click.prevent="props.previous" class="flex gap-x-[10px] bg-[#F2F2F7] rounded-full py-2 px-5 w-max text-[#3C3C43]/60">
                <i class="bi bi-chevron-left"></i>
                <span>Retour</span>
            </div>
        </div>

        <!-- Friends -->
        <div class="flex flex-col h-3/5 gap-y-14">
            <span class="header">Restez connectés avec vos amis</span>

            <!-- UserCard -->
            <div class="grid w-full gap-3 overflow-hidden overflow-y-auto h-max 2xs:grid-cols-1 xs:grid-cols-2">
                <UserCard v-for="user in users" :data="user" :style="{ shape: EUserCardStyle.FRIEND_REQUEST }" />
            </div>
        </div>

        <!-- Suivant -->
        <div class="flex items-center justify-end w-full gap-x-5">
            <button class="w-1/2 btn-primary">
                <span>Suivant</span>
                <i class="text-xl bi bi-arrow-right-short"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, inject, onMounted, ref } from "vue";

import UserCard from "../../components/user/UserCard.vue";

import type { IUser } from "../../types/User";
import type { IRegistration } from "../../types/Register";
import { EUserCardStyle } from "../../types/UserCardStyle";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ############################################## VARIABLES ##############################################

const users = ref<IUser[]>([]);

const props = inject("props") as IRegistration;

// ############################################## FUNCTIONS ##############################################

onMounted(async () => {
    const user = UtilsAuth.getCurrentUser();

    if (user) {
        const idUser = user.id;

        const request = await UtilsApi.getAffinities(idUser);

        if (request) {
            users.value = request;
        }
    }
});

</script>
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
                <UserCard v-for="user in users" :data="{ user: user, style: 'SQUARE', action: 'FRIEND_REQUEST' }" />
            </div>
        </div>

        <!-- Suivant -->
        <Button @@click="props.next()" :data="nextBtnStyle" />
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";

import UserCard from "../../components/UserCard.vue";
import Button from "../../components/Button.vue";

import type { IUser } from "../../types/User";
import type { IRegistration } from "../../types/Register";
import type { IButton } from "../../types/Button";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ############################################## VARIABLES ##############################################

const props = inject("props") as IRegistration;
const users = ref<IUser[]>([]);
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
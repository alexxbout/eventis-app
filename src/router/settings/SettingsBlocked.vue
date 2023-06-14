<template>
    <div class="margins flex flex-col gap-y-14 mb-20">
        <div class="flex gap-x-[15px] items-center justify-center w-max">
            <i @click="router.push({ name: 'settings' })" class="bi bi-arrow-left-short back"></i>

            <span class="header">Bloqués</span>
        </div>

        <div class="flex flex-col w-full gap-y-3">
            <UserCard v-for="user in users" :data="{ action: 'UNBLOCK_FRIEND', style: 'RECTANGLE', user: user }" />

            <div v-if="users.length == 0">
                <span>Aucun utilisateur bloqué</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import UserCard from "../../components/UserCard.vue";
import { onMounted, ref } from "vue";
import type { IUser, IBlocked } from "../../types/interfaces";
import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

const router  = useRouter();
const user    = UtilsAuth.getCurrentUser()!;
const blocked = ref<IBlocked[]>([]);
const users   = ref<IUser[]>([]);

onMounted(async () => {
    blocked.value = await UtilsApi.getAllBlocked(user.id);

    for (const id of blocked.value) {
        const userBlocked = await UtilsApi.getUserById(id.idBlocked);
        if (userBlocked) {
            users.value.push(userBlocked);
        }
    }
});

</script>
<template>
    <div class="margins flex flex-col gap-y-14 mb-20">
        <div class="flex gap-x-[15px] items-center justify-center w-max">
            <i @click="router.push({ name: 'profile' })" class="bi bi-arrow-left-short back"></i>

            <span class="header">Amis</span>
        </div>

        <div class="flex flex-col w-full gap-y-3">
            <UserCard v-for="user in friends" :data="{ action: 'SHOW_PROFIL', style: 'RECTANGLE', user: user }" />

            <div v-if="friends.length == 0">
                <span>Aucun ami</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { IUser } from "../../types/interfaces";
import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";
import { useRouter } from "vue-router";
import UserCard from "./users/UserCard.vue";

const user    = UtilsAuth.getCurrentUser()!;
const router  = useRouter();
const friends = ref<IUser[]>([]);

onMounted(async () => {
    friends.value = await UtilsApi.getAllFriends(user.id);
});

</script>
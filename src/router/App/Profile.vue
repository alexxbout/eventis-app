<template>
    <div class="relative flex flex-col mb-20 gap-y-16 margins">

        <div class="flex items-center w-full gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i class="text-3xl bi bi-person-circle"></i>
                <span class="header">Profil</span>
            </div>
        </div>

        <!-- Header : Picture + fullname + settings -->
        <div class="flex gap-x-5 items-center justify-center w-max">
            <UserProfilPicture :data="{ pic: user?.pic, style: 'LARGE' }" />

            <div class="flex flex-col gap-y-5 font-medium text-3xl">
                <span>{{ user?.firstname + ' ' + user?.lastname }}</span>

                <Button :data="{ apparence: { color: 'BLUE', size: 'XS', type: 'SECONDARY', rounded: 'FULL' }, text: 'Paramètres du compte' }" />
            </div>
        </div>

        <!-- Bio -->
        <div class="flex flex-col gap-y-5">
            <span class="font-medium text-xl">Bio</span>
            <span class="text-base text-gray-400">{{ user?.bio }}</span>
        </div>

        <!-- Friends -->
        <div class="flex flex-col gap-y-5">
            <span class="font-medium text-xl">Amis</span>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center justify-center w-max">
                    <UserProfilPicture class="-mx-2" v-for="friend in friends" :data="{ pic: friend?.pic, style: 'SMALL' }" />
                </div>

                <Button :data="{apparence: { color: 'BLUE', size: 'XS', type: 'SECONDARY', rounded: 'FULL'}, text: 'Voir plus'}" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "../../components/Button.vue";
import UserProfilPicture from "../../components/UserProfilPicture.vue";
import UtilsAuth from "../../utils/UtilsAuth";
import type { IUser } from "../../types/User";
import UtilsApi from "../../utils/UtilsApi";

const MAX_FRIENDS = 5;
const user = UtilsAuth.getCurrentUser();

const friends = ref<IUser[]>([]);

onMounted(async () => {
    let data = await UtilsApi.getAllFriends(user!.id);

    console.log(data);

    if (data) {
        friends.value = data.slice(0, MAX_FRIENDS);
    }
});
</script>



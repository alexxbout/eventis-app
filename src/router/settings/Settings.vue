<template>
    <div class="flex flex-col justify-between margins h-screen">
        <div class="flex flex-col justify-center gap-y-6">

            <div class="flex gap-x-[15px] items-center justify-center w-max">

                <i @click="router.push({ name: 'profile' })" class="bi bi-arrow-left-short back"></i>

                <!-- <i class="text-[27px] bi bi-star-fill"></i> -->
                <span class="header">Réglages</span>
            </div>

            <div class="flex justify-center items-center gap-x-5 w-full bg-[#FAFAFA] rounded-[30px] p-5">
                <div class="relative">
                    <UserProfilPicture :data="{ pic: user?.pic, style: 'LARGE' }" />
                    <i class="absolute -bottom-0 -right-0 bi bi-camera-fill h-7 w-7 text-center flex items-center justify-center text-white text-xs bg-primary rounded-full"></i>
                </div>

                <div class="flex flex-col">
                    <span class="text-2xl font-medium">{{ user?.firstname + ' ' + user?.lastname }}</span>
                    <span class="text-gray-400 text-sm">{{ "@" + user?.login }}</span>
                </div>
            </div>

            <button v-for="tab in tabs" @click="handleSection(tab.route)" class="flex justify-between items-center w-full bg-[#FAFAFA] rounded-[30px] p-5">
                <div class="w-max flex items-center justify-center gap-x-2">
                    <i :class="tab.icon" class="text-lg"></i>
                    <span>{{ tab.name }}</span>
                </div>

                <i class="bi bi-chevron-right text-lg"></i>
            </button>
        </div>

        <div>
            <button @click="handleLogout" class="flex justify-center items-center w-full bg-[#FAFAFA] rounded-[30px] p-5 gap-x-2 text-custom-red font-medium">
                <i class="bi bi-power text-lg"></i>
                <span>Déconnexion</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IUser } from "../../types/interfaces";
import UtilsAuth from "../../utils/UtilsAuth";
import UserProfilPicture from "../../components/UserProfilPicture.vue";
import { useRouter } from "vue-router";
import Button from "../../components/Button.vue";

const user = ref<IUser>(UtilsAuth.getCurrentUser()!);
const router = useRouter();

interface ITab {
    icon: string;
    name: string;
    route: string;
}

const tabs = ref<ITab[]>([
    { icon: "bi bi-person-vcard-fill", name: "Informations personnelles", route: "settingsInfos" },
    { icon: "bi bi-shield-lock-fill", name: "Mot de passe", route: "settingsPassword" },
    { icon: "bi bi-star-fill", name: "Centres d'intérêts", route: "settingsInterests" },
    { icon: "bi bi-person-fill", name: "Utilisateurs bloqués", route: "settingsBlocked" }
]);

const handleLogout = () => {
    UtilsAuth.logout();
    router.push({ name: "home" });
};

const handleSection = (route: string) => {
    router.push({ name: route });
};

</script>
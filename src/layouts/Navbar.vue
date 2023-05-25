<template>
    <div ref="navbar" v-if="isVisible" class="fixed z-10 flex items-center justify-center w-screen opacity-100 bottom-4">
        <div class="gap-12 py-4 px-5 w-full mx-5 shadow-navbar rounded-[20px] grid grid-cols-5 text-xs bg-white">

            <div v-for="tab in tabs">
                <div v-if="tab.custom" @click="openSearch">
                    <div class="flex items-center justify-center w-full">
                        <div class="absolute w-[60px] h-[60px] bg-primary rounded-full -inset-y-5 flex items-center justify-center">
                            <i class="text-[30px] text-white" :class="tab.svg"></i>
                        </div>
                    </div>
                </div>

                <router-link v-else :to="tab.path" :class="getStatusClass(tab.path)" class="flex flex-col items-center justify-center focus:bg-none">
                    <i :class="tab.svg" class="text-2xl"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ITab } from "../types/interfaces";

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// ########################################### Variables ###########################################  
const navbar = ref<HTMLElement | null>(null);
const isVisible = ref(true);

const router = useRouter();
const currentRoute = useRoute();

const tabs = ref<ITab[]>([
    { name: "Accueil", path: "/events", svg: "bi bi-house-fill" },
    { name: "Messages", path: "/messages", svg: "bi bi-chat-fill" },
    { name: "Recherche", path: "", svg: "bi bi-person-plus-fill", custom: true },
    { name: "Profil", path: "/profile", svg: "bi bi-person-circle" },
    { name: "Notifs", path: "/notifs", svg: "bi bi-bell-fill" }
]);

// ########################################### Fonctions ###########################################
onMounted(async () => {
    await router.isReady();

    const meta = currentRoute.meta;    

    if (meta.hideNavbar) {
        hide();
    } else {
        show();
    }
});

function getStatusClass(to: string) {
    return to == currentRoute.path ? "active" : "inactive";
}

function hide() {
    console.log("hide");
    
    isVisible.value = false;
}

function show() {
    console.log("show");
    isVisible.value = true;
}

router.beforeEach((to, from) => {
    const meta = to.meta;

    if (meta.hideNavbar) {
        hide();
    } else {
        show();
    }
});

// ########################################### Evenements ###########################################
const emit = defineEmits(["@open-search"]);

const openSearch = () => {
    emit("@open-search");
}
</script>
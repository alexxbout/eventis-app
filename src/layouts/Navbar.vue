<template>
    <!-- Navbar variant 1 -->
    <div v-if="variant == 1" class="fixed bottom-0 w-screen flex items-center justify-center z-10 opacity-100">

        <div :class="showLabels ? 'gap-5 p-2' : 'gap-12 py-4 px-5'" class="border-t w-screen grid grid-cols-5 text-xs bg-white/90 backdrop-blur-lg">

            <div v-for="tab in tabs">
                <div v-if="tab.custom" @click="openSearch">
                    <div class="w-full flex items-center justify-center">
                        <div class="absolute w-[60px] h-[60px] bg-primary rounded-full -inset-y-5 flex items-center justify-center">
                            <i class="text-[30px] text-white" :class="tab.svg"></i>
                        </div>
                    </div>
                </div>

                <router-link v-else :to="tab.path" :class="getStatusClass(tab.path)" class="flex flex-col items-center justify-center focus:bg-none">
                    <div class="w-full flex flex-col items-center justify-center">
                        <i :class="tab.svg" class="text-2xl"></i>
                        <span v-if="showLabels">{{ tab.name }}</span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>

    <div v-else="variant == 2" class="fixed bottom-1 w-screen flex items-center justify-center z-10 opacity-100">

        <div :class="showLabels ? 'gap-5 p-2' : 'gap-12 py-4 px-5'" class="w-full mx-5 shadow-navbar rounded-[20px] grid grid-cols-5 text-xs bg-white">

            <div v-for="tab in tabs">
                <div v-if="tab.custom" @click="openSearch">
                    <div class="w-full flex items-center justify-center">
                        <div class="absolute w-[60px] h-[60px] bg-primary rounded-full -inset-y-5 flex items-center justify-center">
                            <i class="text-[30px] text-white" :class="tab.svg"></i>
                        </div>
                    </div>
                </div>

                <router-link v-else :to="tab.path" :class="getStatusClass(tab.path)" class="flex flex-col items-center justify-center focus:bg-none">
                    <div class="w-full flex flex-col items-center justify-center">
                        <i :class="tab.svg" class="text-2xl"></i>
                        <span v-if="showLabels">{{ tab.name }}</span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ITab } from "../types/interfaces";

import { ref } from "vue";
import { useRoute } from "vue-router";

// ########################################### Variables ###########################################  
const current = useRoute();

const tabs = ref<ITab[]>([
    { name: "Accueil", path: "/", svg: "bi bi-house-fill" },
    { name: "Messages", path: "/messages", svg: "bi bi-chat-fill" },
    { name: "Recherche", path: "", svg: "bi bi-person-plus-fill", custom: true },
    { name: "Profil", path: "/profile", svg: "bi bi-person-circle" },
    { name: "Notifs", path: "/notifs", svg: "bi bi-bell-fill" }
]);

const showLabels = ref(false);
const variant = ref(2);

// ########################################### Fonctions ###########################################
function getStatusClass(to: string) {
    return to == current.path ? "active" : "inactive";
}

// ########################################### Evenements ###########################################
const emit = defineEmits(["@open-search"]);

const openSearch = () => {
    emit("@open-search");
}
</script>
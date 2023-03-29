<template>
    <div class="border-t-[0.2px] border-custom-gray fixed w-screen bottom-0 py-2 bg-white grid grid-cols-5 text-xs">

        <router-link v-for="tab in tabs" class="flex flex-col items-center justify-center focus:bg-none" :class="getStatusClass(tab.path)" :to="tab.path">

            <i v-if="tab.name != 'Recherche'" :class="tab.svg" class="text-2xl"></i>
            <span v-if="tab.name != 'Recherche'">{{ tab.name }}</span>

            <div v-else class="w-full flex items-center justify-center">
                <div class="absolute w-[65px] h-[65px] bg-primary rounded-full -inset-y-6 flex items-center justify-center">
                    <i class="text-3xl text-white" :class="tab.svg"></i>
                </div>
            </div>
        </router-link>

    </div>
</template>

<script setup lang="ts">

/**
 * TODO :
 * - Check for inexistant routes when the user manually types the url
 */

/**
 * NOTES :
 * 
 * onBeforeRoute... : called insed a component child of the <router-view> when the route changes
 * router.beforeEach : called outside of a component, when the route changes
 */

import { Ref, ref } from "vue";
import { useRoute } from "vue-router";

const current = useRoute();

interface tab {
    name: string;
    path: string;
    svg?: string;
}

const tabs: Ref<tab[]> = ref([
    { name: "Accueil", path: "/", svg: "bi bi-house-fill" },
    { name: "Messages", path: "/messages", svg: "bi bi-chat-fill" },
    { name: "Recherche", path: "", svg: "bi bi-person-plus-fill" },
    { name: "Profil", path: "/profil", svg: "bi bi-person-circle" },
    { name: "Notifs", path: "/notifs", svg: "bi bi-bell-fill" }
]);

function getStatusClass(to: string) {
    return to == current.path ? "active" : "inactive";
}
</script>
<template>
    <div ref="navbar" v-if="isVisible && user" class="fixed z-10 flex items-center justify-center w-screen opacity-100 bottom-1">
        <div class="grid w-full grid-cols-5 py-4 mx-5 text-xs gap-x-10 rounded-3xl px-7 bg-white/80 backdrop-blur-lg backdrop-saturate-200 shadow-navbar">

            <div v-for="tab in (user.idRole == 2 ? userTabs : adminTabs)">
                <div v-if="tab.custom" @click="openSearch">
                    <div class="flex items-center justify-center w-full">
                        <div class="absolute w-[60px] h-[60px] bg-primary rounded-full -inset-y-5 flex items-center justify-center hover:bg-blue-800 transition-colors">
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
import type { ITab, IUser } from "../types/interfaces";

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import UtilsAuth from "../utils/UtilsAuth";
import { RouteRecordRaw } from "vue-router";
import { RouteLocationNormalized } from "vue-router";

// ########################################### VARIABLES ###########################################

const navbar = ref<HTMLElement | null>(null);
const isVisible = ref(true);
const router = useRouter();
const currentRoute = useRoute();
const user = ref<IUser | null>(UtilsAuth.getCurrentUser());

const userTabs = ref<ITab[]>([
    { path: "/events", svg: "bi bi-house-fill" },
    { path: "/messages", svg: "bi bi-chat-fill" },
    { path: "", svg: "bi bi-person-plus-fill", custom: true },
    { path: "/profile", svg: "bi bi-person-circle" },
    { path: "/notifs", svg: "bi bi-bell-fill" }
]);

const adminTabs = ref<ITab[]>([
    { path: "/events", svg: "bi bi-house-fill" },
    { path: "/messages", svg: "bi bi-chat-fill" },
    // { path: "/admin/events/add", svg: "bi bi-calendar2-plus-fill"},
    { path: "/profile", svg: "bi bi-person-circle" },
    { path: "/notifs", svg: "bi bi-bell-fill" },
    { path: "/admin", svg: "bi bi-gear-fill" } // bi bi-box-fill
]);

// ########################################### FUNCTIONS ###########################################

router.beforeEach((to, from) => {
    updateVisibility(to);
});

onMounted(async () => {
    await router.isReady();

    updateVisibility(currentRoute);
});

const getStatusClass = (to: string) => {
    return currentRoute.path.includes(to) ? "active" : "inactive";
}

const updateVisibility = (to: RouteLocationNormalized) => {
    if (to.meta.hideNavbar) {
        hide();
    } else {
        show();
    }
}

const hide = () => {
    isVisible.value = false;
    reloadUser();
}

const show = () => {
    isVisible.value = true;
    reloadUser();
}

const reloadUser = () => {
    user.value = UtilsAuth.getCurrentUser();
}

// ########################################### EVENTS ###########################################

const emit = defineEmits(["@open-search"]);

const openSearch = () => {
    emit("@open-search");
}
</script>
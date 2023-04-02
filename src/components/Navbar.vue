<template>
    <div class="fixed bottom-1 w-screen flex items-center justify-center z-10">

        <div :class="showLabels ? 'gap-5 p-2' : 'gap-12 py-4 px-6'" class="rounded-3xl shadow-navbar w-max grid grid-cols-5 text-xs bg-black/80 backdrop-blur-[33px] bg-blend-overlay">

            <div v-for="tab in tabs">
                <div v-if="tab.preventRender" @click="searchCallBack">
                    <div class="w-full flex items-center justify-center">
                        <div class="absolute w-[60px] h-[60px] bg-primary rounded-full -inset-y-6 flex items-center justify-center">
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

import { Ref, ref, toRefs, PropType } from "vue";
import { useRoute } from "vue-router";

defineProps({
    searchCallBack: {
        type: Function as PropType<() => void>,
        required: true
    }
});

const current = useRoute();

interface tab {
    name: string;
    path: string;
    svg: string;
    preventRender?: boolean;
}

const tabs: Ref<tab[]> = ref([
    { name: "Accueil", path: "/", svg: "bi bi-house-fill" },
    { name: "Messages", path: "/messages", svg: "bi bi-chat-fill" },
    { name: "Recherche", path: "", svg: "bi bi-search", preventRender: true },
    { name: "Profil", path: "/profile", svg: "bi bi-person-circle" },
    { name: "Notifs", path: "/notifs", svg: "bi bi-bell-fill" }
]);

const showLabels = ref(false);

function getStatusClass(to: string) {
    return to == current.path ? "active" : "inactive";
}

</script>
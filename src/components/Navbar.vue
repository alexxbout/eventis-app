<template>
    <div ref="el" class="fixed bottom-0 w-screen flex items-center justify-center z-10 opacity-100">

        <div :class="showLabels ? 'gap-5 p-2' : 'gap-12 py-3 px-5'" class="border-t w-screen grid grid-cols-5 text-xs bg-white">

            <div v-for="tab in tabs">
                <div v-if="tab.preventRender" @click="searchCallBack">
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

const el = ref<HTMLElement | null>(null);

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
    { name: "Recherche", path: "", svg: "bi bi-person-plus-fill", preventRender: true },
    { name: "Profil", path: "/profile", svg: "bi bi-person-circle" },
    { name: "Notifs", path: "/notifs", svg: "bi bi-bell-fill" }
]);

const showLabels = ref(true);

function getStatusClass(to: string) {
    return to == current.path ? "active" : "inactive";
}

defineExpose({
    el
});

</script>
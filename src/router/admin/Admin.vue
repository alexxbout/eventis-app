<template>
    <div class="flex flex-col margins h-screen">
        <div class="flex flex-col justify-center gap-y-6">

            <!-- Header -->
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <span class="header">Administration</span>
            </div>

            <!-- Actions -->
            <div class="bg-[#FAFAFA] rounded-[30px] p-5 w-full flex flex-col divide-y">
                <button v-for="tab in tabs" @click="handleSection(tab.route)" class="flex justify-between items-center w-full first:pt-0 pt-5 last:pb-0 pb-5">
                    <div class="w-max flex items-center justify-center gap-x-2">
                        <i :class="tab.icon" class="text-lg"></i>
                        <span>{{ tab.name }}</span>
                    </div>

                    <i class="bi bi-chevron-right text-lg"></i>
                </button>
            </div>
            <!-- <button v-for="tab in tabs" @click="handleSection(tab.route)" class="flex justify-between items-center w-full bg-[#FAFAFA] rounded-[30px] p-5">
                <div class="w-max flex items-center justify-center gap-x-2">
                    <i :class="tab.icon" class="text-lg"></i>
                    <span>{{ tab.name }}</span>
                </div>

                <i class="bi bi-chevron-right text-lg"></i>
            </button> -->

            <!-- Recherche -->
            <button @click="handleSearch" class="flex flex-col gap-y-3 justify-center items-center w-full bg-[#FAFAFA] rounded-[30px] p-5">
                <div class="flex items-center justify-center w-full">
                    <div class="w-[60px] h-[60px] bg-primary rounded-full -inset-y-5 flex items-center justify-center hover:bg-blue-800 transition-colors">
                        <i class="bi bi-person-plus-fill text-[30px] text-white"></i>
                    </div>
                </div>
                <span class="font-semibold text-xl">Recherche</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, inject, ref } from "vue";
import type { ISection } from "../../types/interfaces";
import { useRouter } from "vue-router";
import Button from "../../components/Button.vue";
import Search from "../../layouts/Search.vue";

const search = inject("props") as Ref<InstanceType<typeof Search> | null>;

const router = useRouter();

const tabs = ref<ISection[]>([
    { icon: "bi bi-house-heart-fill", name: "Foyer", route: "" },
    { icon: "bi bi-braces-asterisk", name: "Codes d'enregistrement", route: "" },
    { icon: "bi bi-calendar2-week-fill", name: "Événements", route: "" },
]);

const handleSection = (route: string) => {
    router.push({ name: route });
};

const handleSearch = () => {
    search.value?.open();
};

</script>
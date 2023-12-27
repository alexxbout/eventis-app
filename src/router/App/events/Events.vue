<template>
    <div class="relative flex flex-col mb-20 gap-y-5 margins">

        <div class="flex items-center justify-between w-full gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <!-- <i class="text-[27px] bi bi-house"></i> -->
                <span class="header">Évènements</span>
            </div>

            <!-- Custom switch -->
            <div class="bg-[#EFEFEF] rounded-full w-max h-max grid grid-flow-col p-1 gap-x-2 overflow-hidden">
                <input type="radio" :name="randomId" id="list" class="appearance-none hidden peer/list" value="list" :checked="selected === 'list'" @change="handleSelector">
                <label for="list" class="px-5 py-2 w-full h-full rounded-full peer-checked/list:bg-white peer-checked/list:text-black text-[#A2A2A2] text-lg">
                    <i class="bi bi-view-stacked text-sm"></i>
                </label>

                <input type="radio" :name="randomId" id="calendar" class="appearance-none hidden peer/calendar" value="calendar" :checked="selected === 'calendar'" @change="handleSelector">
                <label for="calendar" class="px-5 py-2 w-full h-full rounded-full peer-checked/calendar:bg-white peer-checked/calendar:text-black text-[#A2A2A2] text-lg">
                    <i class="bi bi-calendar3 text-sm"></i>
                </label>
            </div>
        </div>

        <div class="flex flex-col w-full gap-y-10">
            <EventsList v-if="selected === 'list'" />
            <EventsCalendar v-if="selected === 'calendar'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import EventsList from "./EventsList.vue";

import { useRoute } from "vue-router";
import EventsCalendar from "./EventsCalendar.vue";

// ########################################### VARIABLES ###########################################

const randomId = ref<string>(Math.floor(Math.random() * 1000000).toString());

const selected = ref<string>("list");

const route = useRoute();
const router = useRouter();

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    if (route.path.includes("/calendar")) {
        selected.value = "calendar";
        router.replace({ path: "/events/calendar" });
    }
});

// ########################################### HANDLERS ###########################################

const handleSelector = () => {
    if (selected.value === "list") {
        selected.value = "calendar";
        router.replace({ path: "/events/calendar" });
    } else {
        selected.value = "list";
        router.replace({ path: "/events" });
    }
};

</script>
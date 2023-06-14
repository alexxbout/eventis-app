<template>
    <div class="margins flex flex-col gap-y-14 mb-20">
        <div class="flex gap-x-[15px] items-center justify-center w-max">
            <i @click="router.push({ name: 'settings' })" class="bi bi-arrow-left-short back"></i>
            <span class="header">Centres d'intérêts</span>
        </div>


        <div class="flex flex-col w-full gap-y-3">
            <InterestCard v-for="data in interests" ref="cards" @@click="handleClick" :data="data.interests" :selected="data.selected" :disabled="data.disabled" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import InterestCard from "../../components/InterestCard.vue";

import type { IInterest } from "../../types/interfaces";

import UtilsAuth from "../../utils/UtilsAuth";
import UtilsApi from "../../utils/UtilsApi";
import { useRouter } from "vue-router";

// ############################################## VARIABLES ##############################################

const MAX_INTERESTS = 3;

const interests = ref<{ interests: IInterest, selected: boolean, disabled?: boolean }[]>([]);
const user = UtilsAuth.getCurrentUser();
const router = useRouter();

// ############################################## FUNCTIONS ##############################################

onMounted(async () => {
    // Get all interests
    const allInterests = await UtilsApi.getAllInterests();

    // Get all interests selected by the user
    const userInterests = await UtilsApi.getUserInterests(user!.id);

    // Save all interests and if they are selected by the user
    interests.value = allInterests.map((interest) => {
        return {
            interests: interest,
            selected: userInterests.some((userInterest) => userInterest.id === interest.id)
        };
    });

    // Sort array by selected
    interests.value.sort((a, b) => {
        if (a.selected && !b.selected) {
            return -1;
        }

        if (!a.selected && b.selected) {
            return 1;
        }

        return 0;
    });

    // Disable all non selected cards if the user has selected MAX_INTERESTS interests
    if (getSelectedCount() >= MAX_INTERESTS) {
        disableNonSelected();
    }
});

const getSelectedCount = () => {
    return interests.value.filter((interest) => interest.selected).length;
};

const enableOthers = () => {
    // Enable all cards
    interests.value.forEach((interest) => {
        interest.disabled = false;
    });
};

const disableNonSelected = () => {
    // Disable all non selected cards
    interests.value.forEach((interest) => {
        if (!interest.selected) {
            interest.disabled = true;
        }
    });
};

// ############################################## HANDLERS ##############################################

const handleClick = async (id: number) => {
    // Find the interest with the id in the array
    const interest = interests.value.find((interest) => parseInt(interest.interests.id) == id);

    if (interest && !interest.selected && getSelectedCount() < MAX_INTERESTS) {
        // Change the selected value
        interest.selected = true;

        // Call API
        await UtilsApi.addUserInterest(user!.id, id);

        if (getSelectedCount() >= MAX_INTERESTS) {
            disableNonSelected();
        }
    } else if (interest && interest.selected) {
        handleRemove(id);
    }
};

const handleRemove = (id: number) => {
    // Find the interest with the id in the array
    const interest = interests.value.find((interest) => parseInt(interest.interests.id) == id);

    if (interest && interest.selected) {
        // Change the selected value
        interest.selected = false;

        // Call API
        UtilsApi.deleteUserInterest(user!.id, id);

        if (getSelectedCount() < MAX_INTERESTS) {
            enableOthers();
        }
    }
};
</script>
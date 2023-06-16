<template>
    <div class="flex flex-col justify-around w-full h-full">
        <!-- Retour -->
        <div class="flex items-center w-full">
            <i @click.prevent="props.previous()" class="bi bi-arrow-left-short bg-[#F2F2F7] text-center flex items-center justify-center text-3xl text-[#3C3C43]/60 w-12 h-12 aspect-square rounded-full"></i>
        </div>

        <div class="flex flex-col h-3/5 gap-y-14">
            <div class="flex flex-col gap-y-4">
                <span class="header">Complétez votre profil avec vos centres d'intérêt</span>
                <span class="text-gray-500">Sélectionnez au maximum 3 centres d'intérêts qui seront affichés sur votre profil.</span>
            </div>

            <div class="grid w-full grid-cols-1 gap-3 overflow-hidden overflow-y-auto h-max">
                <InterestCard v-for="data in interests" @@click="handleClick" :data="data.interests" :selected="data.selected" :disabled="data.disabled" />
            </div>
        </div>

        <!-- Suivant -->
        <Button class="w-full" @@click="props.next()" :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY' }, text: 'Suivant', icon: { name: 'ARROW_RIGHT', side: 'RIGHT' } }" />
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";

import InterestCard from "../../components/InterestCard.vue";
import Button from "../../components/Button.vue";

import type { IRegistration, IInterest } from "../../types/interfaces";

import UtilsAuth from "../../utils/UtilsAuth";
import UtilsApi from "../../utils/UtilsApi";

// ############################################## VARIABLES ##############################################

const MAX_INTERESTS = 3;

const props = inject("props") as IRegistration;
const interests = ref<{ interests: IInterest, selected: boolean, disabled?: boolean }[]>([]);
const user = UtilsAuth.getCurrentUser();

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
            // selected: userInterests.some((userInterest) => userInterest.id === interest.id)
            selected: false
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
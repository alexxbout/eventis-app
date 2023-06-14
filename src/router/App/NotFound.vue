<template>
    <div class="flex flex-col items-center justify-around w-full h-screen overflow-hidden margins">

        <div class="flex flex-col items-center justify-center gap-y-10 h-max">
            <!-- Emoji -->
            <Emoji :data="{ name: emoji, size: 'BIG' }" />

            <!-- Text -->
            <div class="flex flex-col gap-y-4">
                <span class="header leading-10">La page demandée n’a pas été trouvée...</span>
            </div>
        </div>

        <!-- Button -->
        <Button class="w-full" :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY' }, icon: { name: 'ARROW_RIGHT', side: 'RIGHT' }, text: 'Retourner à l\'accueil' }" @@click="router.push({ name: 'home' })" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import Emoji from "../../components/Emoji.vue";
import Button from "../../components/Button.vue";

// ########################################### VARIABLES ###########################################

const router = useRouter();
const emojis = ["ufo", "island", "robot", "beach"];
const emoji  = ref(emojis[Math.floor(Math.random() * emojis.length)]);
</script>
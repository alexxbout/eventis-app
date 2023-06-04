<template>
    <div class="flex flex-col items-center justify-around w-full h-full max-h-screen overflow-hidden">

        <div class="flex flex-col items-center justify-center gap-y-10 h-max">
            <!-- Emoji -->
            <Emoji :data="{ name: 'party_popper', size: 'BIG' }" />

            <!-- Text -->
            <div class="flex flex-col gap-y-4">
                <span class="header">Félicitations, votre profil est configuré !</span>
                <span class="text-gray-500">Vous pourrez modifier votre profil dans les paramètres de l’application.</span>
            </div>
        </div>

        <!-- Button -->
        <Button class="w-full" :data="{apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY'}, text: 'Accéder'}" @@click="router.push({ name: 'events' })" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Emoji from "../../components/Emoji.vue";
import Button from "../../components/Button.vue";

const router = useRouter();

</script>
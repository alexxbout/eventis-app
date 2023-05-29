<template>
    <div class="flex flex-col items-center justify-around w-full h-full max-h-screen overflow-x-hidden overflow-y-hidden">

        <div class="flex flex-col gap-y-4">
            <span class="header">Félicitations, votre profil est configuré</span>
            <span class="text-gray-500">Vous pourrez modifier votre profil dans les paramètres de l’application.</span>
        </div>

        <div @click="handleNext" class="relative">
            <button @click="handleNext" class="shadow-[0px_0px_60px_25px_rgba(22,108,247,0.25)] z-10 bg-gradient-to-b from-[#357FF8] to-[#085DE8] rounded-full w-[200px] h-[200px] flex items-center justify-center">
                <span class="text-xl font-semibold text-white">Suivant</span>
            </button>

            <div class="w-[260px] h-[260px] absolute bg-transparent border rounded-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 border-primary/100 z-0"></div>
            <div class="w-[320px] h-[320px] absolute bg-transparent border rounded-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 border-primary/80 z-0"></div>
            <div class="w-[380px] h-[380px] absolute bg-transparent border rounded-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 border-primary/60 z-0"></div>
            <div class="w-[440px] h-[440px] absolute bg-transparent border rounded-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 border-primary/40 z-0"></div>
            <div class="w-[500px] h-[500px] absolute bg-transparent border rounded-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 border-primary/20 z-0"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const handleNext = () => {
    router.push({ name: "events" });
}

</script>
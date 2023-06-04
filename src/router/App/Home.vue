<template>
    <div class="flex flex-col items-center justify-around w-screen h-screen margins">

        <!-- Login modal -->
        <div v-show="showModal" ref="modal" class="fixed bottom-0 flex flex-col w-screen h-screen">

            <div @click="closeLogin" class="w-full h-full"></div>

            <form @submit.prevent="handleLogin" class="bg-white w-full h-max rounded-t-[35px] shadow-modal justify-between flex flex-col p-12 gap-y-20">
                <div class="flex flex-col gap-y-7">
                    <div>
                        <label for="">Identifiant</label>
                        <input v-model="loginField" type="text" placeholder=" " class="input" required>
                    </div>

                    <div>
                        <label for="">Mot de passe</label>
                        <input v-model="passwordField" type="password" placeholder=" " class="input" required>
                    </div>
                </div>

                <Button class="w-full" :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY' }, text: 'Se connecter', type: 'submit' }" />
            </form>
        </div>

        <div class="flex flex-col items-center justify-around w-full h-full">
            <!-- Home -->
            <div class="flex flex-col gap-y-5">
                <span class="text-5xl font-bold">Diversia</span>
                <span class="font-light text-gray-500">Notre application de messagerie est un espace de partage et de connexion pour les personnes en situation de handicap, pour créer des relations positives et épanouissantes.</span>
            </div>

            <div>
                <img class="" src="/src/assets/welcome.svg" alt="">
            </div>

            <div class="flex items-center w-full gap-5">
                <Button class="w-full" @click="openRegistration" :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'SECONDARY', rounded: 'BASE' }, text: 'Rejoindre' }" />
                <Button class="w-full" @click="openLogin" :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY', rounded: 'BASE' }, text: 'Se connecter' }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { gsap, Power4 } from "gsap";

import UtilsAuth from "../../utils/UtilsAuth";

import Button from "../../components/Button.vue";

const router = useRouter();
const loginField = ref("");
const passwordField = ref("");
const showModal = ref(false);
const modal = ref<HTMLElement | null>(null);

onMounted(() => {
    gsap.to(modal.value, { translateY: "150%" });
});

const openRegistration = () => {
    if (UtilsAuth.isLoggedIn()) {
        router.push({ name: "events" });
    } else {
        router.push({ name: "register" });
    }
}

const openLogin = () => {
    if (UtilsAuth.isLoggedIn()) {
        router.push({ name: "events" });
    } else {
        showModal.value = true;

        gsap.to(modal.value,
            {
                duration: 0.7,
                translateY: "0%",
                ease: Power4.easeOut
            });
    }
}

const closeLogin = () => {
    gsap.to(modal.value,
        {
            duration: 0.7,
            translateY: "150%",
            ease: Power4.easeInOut
        }).then(() => {
            showModal.value = false;
        });
}

const handleLogin = async () => {
    await UtilsAuth.login(loginField.value, passwordField.value);

    if (UtilsAuth.isLoggedIn()) {
        router.push({ name: "events" });
    }
}

</script>
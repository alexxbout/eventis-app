<template>
    <div class="flex flex-col items-center justify-around w-screen h-screen margins">

        <!-- Login modal -->
        <div v-show="showModal" class="fixed bottom-0 flex flex-col w-screen h-screen">

            <div @click="showModal = !showModal" class="w-full h-full"></div>

            <form @submit.prevent="handleLogin" class="bg-white w-full h-max rounded-t-[35px] shadow-modal justify-between flex flex-col p-12 gap-y-10">
                <div class="flex flex-col gap-y-7">
                    <div>
                        <label for="">Identifiant</label>
                        <input v-model="loginField" type="text" placeholder=" " class="input" required>
                    </div>

                    <div>
                        <label for="">Mot de passe</label>
                        <input v-model="passwordField" type="password" placeholder=" " class="input" required>

                        <button class="pt-5 font-semibold text-primary">J'ai reçu un code d'invitation</button>
                    </div>
                </div>

                <button type="submit" class="bg-primary rounded-[14px] text-white font-semibold text-base w-full h-[45px]">Se connecter</button>
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
                <button @click="openRegistration" class="bg-white border border-primary rounded-[14px] text-primary font-semibold text-base w-full h-[60px]">Rejoindre</button>
                <button @click="showModal = true" class="bg-primary rounded-[14px] text-white font-semibold text-base w-full h-[60px]">Se connecter</button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import UtilsAuth from "../../utils/UtilsAuth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const loginField = ref("");
const passwordField = ref("");

const showModal = ref(false);

function openRegistration() {
    router.push("/register");
}

async function handleLogin() {
    await UtilsAuth.login(loginField.value, passwordField.value);

    if (UtilsAuth.isLoggedIn()) {
        router.push({ name: "events"});
    }
}

</script>
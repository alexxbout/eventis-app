<template>
    <div class="flex flex-col items-center justify-around w-screen h-screen margins">

        <!-- Login modal -->
        <!-- <div v-show="showModal" ref="modal" class="fixed bottom-0 flex flex-col w-screen h-screen">

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
        </div> -->

        <Modal ref="modal" :data="{header: { closeButton: true, title: 'Se connecter'}}">
            <form @submit.prevent="handleLogin" class="w-full h-max justify-between flex flex-col gap-y-20">
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
        </Modal>

        <div class="flex flex-col items-center justify-around w-full h-full">
            <!-- Home -->
            <div class="flex flex-col gap-y-5">
                <span class="text-5xl font-bold">Eventis</span>
                <span class="font-light text-gray-500">Notre application de messagerie est un espace de partage et de connexion pour les personnes en situation de handicap, pour créer des relations positives et épanouissantes.</span>
            </div>

            <div>
                <img class="" src="/src/assets/welcome.svg" alt="">
            </div>

            <div class="flex items-center w-full gap-5">
                <Button class="w-full" @click="openRegistration" :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'SECONDARY', rounded: 'FULL', custom: { height: '100%', padding: '18px 0px' } }, text: 'Rejoindre' }" />
                <Button class="w-full shadow-[0px_0px_100px_5px_rgba(22,108,247,0.3)]" @click="openLogin" :data="{ apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY', rounded: 'FULL', custom: { height: '100%', padding: '18px 0px' } }, text: 'Se connecter' }" />
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
import Modal from "../../components/Modal.vue";

// ########################################### VARIABLES ###########################################

const router = useRouter();
const loginField = ref("");
const passwordField = ref("");
const showModal = ref(false);
const modal = ref<InstanceType<typeof Modal>>();

// ########################################### FUNCTIONS ###########################################

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
        modal.value?.show();
    }
}

const closeLogin = () => {
    modal.value?.hide();
}

const handleLogin = async () => {
    await UtilsAuth.login(loginField.value, passwordField.value);

    if (UtilsAuth.isLoggedIn()) {
        router.push({ name: "events" });
    }
}

</script>
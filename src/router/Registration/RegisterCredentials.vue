<template>
    <form @submit.prevent="handleSubmit" ref="form" class="w-full h-full justify-around flex flex-col">
        <!-- Inputs -->
        <div class="gap-y-20 flex flex-col">
            <span class="header">Création de votre compte</span>
            <div class="flex flex-col gap-y-7">
                <div>
                    <label for="">Nom</label>
                    <input v-model="lastnameInput" @input="handleInput" type="text" class="input" placeholder=" " minlength="1" maxlength="30" required>
                </div>

                <div>
                    <label for="">Prénom</label>
                    <input v-model="firstnameInput" @input="handleInput" type="text" class="input" placeholder=" " minlength="1" maxlength="30" required>
                </div>

                <div>
                    <label for="">Mot de passe</label>
                    <input v-model="passwordInput" @input="handleInput" type="password" class="input" placeholder=" " pattern="^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,100}$" required>

                    <div class="flex w-full justify-between pt-2">
                        <div class="flex flex-col">
                            <div :class="reqUppercase ? 'text-custom-green' : 'text-gray-400'" class="flex gap-x-2">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Une lettre majuscule</span>
                            </div>

                            <div :class="reqLowercase ? 'text-custom-green' : 'text-gray-400'" class="flex gap-x-2">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Une lettre minuscule</span>
                            </div>

                            <div :class="reqNumber ? 'text-custom-green' : 'text-gray-400'" class="flex gap-x-2">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Un chiffre</span>
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <div :class="reqSpecialChar ? 'text-custom-green' : 'text-gray-400'" class="flex gap-x-2">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Un caractère spécial</span>
                            </div>

                            <div :class="reqCount ? 'text-custom-green' : 'text-gray-400'" class="flex gap-x-2">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>8 caractères minimum</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Suivant -->
        <div class="w-full flex items-center justify-end">
            <button :disabled="!readyToSubmit" type="submit" class="btn-primary">
                <span>Suivant</span>
                <i class="bi bi-arrow-right-short text-xl"></i>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
/**
 * Cette classe va gérer la partie données personnelles de l'inscription
 * Elle va ensuite emmetre un évènement pour passer à la partie suivante
 * Il faut alors exposer les données personnelles dans le composant parent
 */

import type { IUser } from "../../types/User";
import { ref, PropType, onBeforeMount, onMounted } from "vue";
import { useRoute } from "vue-router";

// ########################################### Variables ###########################################
const reqUppercase = ref(false);
const reqLowercase = ref(false);
const reqNumber = ref(false);
const reqSpecialChar = ref(false);
const reqCount = ref(false);

const firstnameInput = ref("");
const lastnameInput = ref("");
const passwordInput = ref("");
const readyToSubmit = ref(false);
const form = ref<HTMLFormElement | null>(null);

// ########################################### Evenements ###########################################
const emit = defineEmits(["@sendCredentials"]);

const handleSubmit = () => {
    if (form.value?.checkValidity()) {
        emit("@sendCredentials",
            <IUser>{
                firstname: firstnameInput.value,
                lastname: lastnameInput.value,
                password: passwordInput.value
            });
    }
}

// ########################################### Fonctions ###########################################
function getFormValidity(): boolean {
    if (form.value) {
        return form.value.checkValidity();
    }

    return false;
}

function updateRequirements() {
    const password = passwordInput.value;

    reqUppercase.value = /[A-Z]/.test(password);
    reqLowercase.value = /[a-z]/.test(password);
    reqNumber.value = /[0-9]/.test(password);
    reqSpecialChar.value = /[^A-Za-z0-9]/.test(password);
    reqCount.value = password.length >= 8;
}

function updateFormValidity() {
    readyToSubmit.value = getFormValidity();
}

function handleInput() {
    updateRequirements();
    updateFormValidity();
}

</script>
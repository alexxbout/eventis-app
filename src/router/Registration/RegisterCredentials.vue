<template>
    <form @submit.prevent="handleSubmit" ref="form" class="flex flex-col justify-around w-full h-full">
        <!-- Inputs -->
        <div class="flex flex-col gap-y-20">
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

                    <div class="flex justify-between w-full pt-2">
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
        <div class="flex items-center justify-end w-full">
            <button :disabled="!readyToSubmit" type="submit" class="btn-primary">
                <span>Suivant</span>
                <i class="text-xl bi bi-arrow-right-short"></i>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref} from "vue";

import type { IUser } from "../../types/User";

// ########################################### VARIABLES ###########################################

const reqUppercase   = ref(false);
const reqLowercase   = ref(false);
const reqNumber      = ref(false);
const reqSpecialChar = ref(false);
const reqCount       = ref(false);

const firstnameInput = ref("");
const lastnameInput  = ref("");
const passwordInput  = ref("");
const readyToSubmit  = ref(false);
const form           = ref<HTMLFormElement | null>(null);

// ########################################### EVENTS ###########################################

const emit = defineEmits(["@sendCredentials"]);

// ########################################### HANDLERS ###########################################

function handleInput() {
    updateRequirements();
    updateFormValidity();
}

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

// ########################################### FUNCTIONS ###########################################

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

</script>
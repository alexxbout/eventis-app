<template>
    <form @submit.prevent="handleSubmit" ref="formElement" class="flex flex-col justify-around w-full h-full">
        <div class="margins flex flex-col gap-y-14 mb-20">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i @click="router.push({ name: 'settings' })" class="bi bi-arrow-left-short back"></i>

                <span class="header">Mot de passe</span>
            </div>

            <div class="flex flex-col w-full gap-y-3">
                <div class="flex flex-col gap-y-7">
                    <div>
                        <Input @@update="handleInputOldPassword" :placeholder="' '" :label="'Ancien mot de passe'" :type="'password'" :apparence="'input'" :name="'old_password'" :minlength="8" :maxlength="100" :required="true" />
                    </div>

                    <div>
                        <Input @@update="handleInputNewPassword" :placeholder="' '" :label="'Nouveau mot de passe'" :type="'password'" :apparence="'input'" :name="'new_password'" :pattern="passwordPattern" :minlength="8" :maxlength="100" :required="true" />

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

                    <div class="text-custom-red flex">
                        <span>{{ error }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="fixed bottom-0 flex w-full h-20 p-4 bg-white border-t gap-x-3 z-10">
            <Button class="w-full" :data="btnStyle" :delay="1000" />
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IButton } from "../../../types/interfaces";
import Input from "../../../components/Input.vue";
import Button from "../../../components/Button.vue";
import UtilsApi from "../../../utils/UtilsApi";
import UtilsAuth from "../../../utils/UtilsAuth";

const router = useRouter();

const user = UtilsAuth.getCurrentUser()!;

const passwordPattern = ref(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,100}$/.source);

const reqUppercase = ref(false);
const reqLowercase = ref(false);
const reqNumber = ref(false);
const reqSpecialChar = ref(false);
const reqCount = ref(false);

const oldPasswordInput = ref("");
const newPasswordInput = ref("");

const error = ref("");
const validForm = ref(false);
const formElement = ref<HTMLFormElement | null>(null);

const defaultStyle = ref<IButton>(
    {
        apparence: {
            color: "BLUE",
            size: "BASE",
            type: "PRIMARY"
        },
        text: "Enregistrer",
        disabled: !validForm.value,
        type: "submit"
    });

const successStyle = ref<IButton>(
    {
        apparence: {
            color: "GREEN",
            size: "BASE",
            type: "PRIMARY"
        },
        text: "Informations enregistrées",
        icon: {
            name: "SUCCESS",
            side: "RIGHT"
        }
    });

const errorStyle = ref<IButton>(
    {
        apparence: {
            color: "RED",
            size: "BASE",
            type: "PRIMARY"
        },
        text: "Erreur lors de l'enregistrement",
        type: "submit"
    });

const btnStyle = ref<IButton>(defaultStyle.value);

// ########################################### EVENTS ###########################################

// ########################################### HANDLERS ###########################################

const handleInputOldPassword = (value: string) => {
    oldPasswordInput.value = value;

    updateFormValidity();
};

const handleInputNewPassword = (value: string) => {
    newPasswordInput.value = value;

    updateRequirements();
    updateFormValidity();
};

const handleSubmit = async () => {
    if (validForm.value) {
        const data = await UtilsApi.updateUserPassword(user.id, oldPasswordInput.value, newPasswordInput.value);

        if (data.status) {
            btnStyle.value = successStyle.value;
        } else {
            btnStyle.value = errorStyle.value;
            error.value = data.error;
        }
    }
};

// ########################################### FUNCTIONS ###########################################

const updateFormValidity = () => {
    validForm.value = formElement.value ? formElement.value.checkValidity() : false;

    console.log(validForm.value);

    btnStyle.value.disabled = !validForm.value;
};

const updateRequirements = () => {
    const password = newPasswordInput.value;

    if (password) {
        reqUppercase.value = /[A-Z]/.test(password);
        reqLowercase.value = /[a-z]/.test(password);
        reqNumber.value = /[0-9]/.test(password);
        reqSpecialChar.value = /[^A-Za-z0-9]/.test(password);
        reqCount.value = password.length >= 8;
    }
};
</script>
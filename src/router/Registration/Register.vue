<template>
    <div class="h-screen w-screen margins">
        <RegisterCode ref="registerCode" @@send-code="handleCode" v-if="currentStep == 1" :data="props" />
        <RegisterCredentials ref="registerCredentials" @@send-credentials="handleCredentials" v-if="currentStep == 2" />
        <RegisterPicture v-if="currentStep == 3" />

        <RegisterFriends v-if="currentStep == 4" :data="props" />
    </div>
</template>

<script setup lang="ts">
import type { IRegistration } from "../../types/interfaces";
import type { IUser } from "../../types/User";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

import RegisterCode from "./RegisterCode.vue";
import RegisterCredentials from "./RegisterCredentials.vue";
import RegisterPicture from "./RegisterPicture.vue";
import RegisterFriends from "./RegisterFriends.vue";

import { ref } from "vue";
import { AxiosResponse } from "axios";

// ########################################### Variables ###########################################
const MAX_STEPS = 6;

const registerCode = ref<InstanceType<typeof RegisterCode>>();
const registerCredentials = ref<InstanceType<typeof RegisterCredentials>>();

const currentStep = ref(4);

const code = ref("");
const user = ref<IUser | null>(null);

// ########################################### Fonctions ###########################################
const next = () => {
    if (currentStep.value < MAX_STEPS) {
        currentStep.value++;
    }
}

const previous = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
}

const handleCode = (paramCode: string) => {
    code.value = paramCode;
}

const handleCredentials = (paramUser: IUser) => {
    user.value = paramUser;

    registerUser(user.value);
}

const registerUser = async (user: IUser) => {
    if (code.value && user.password) {

        await UtilsApi.registerUser(code.value, user.firstname, user.lastname, user.password).then((response) => {
            if (response.status == 200) {
                console.log("Account created");

                user.login = response.data.data.login;
            }
        });

        if (user.login) {
            UtilsAuth.login(user.login, user.password).then((response) => {
                if (response.status == 200) {
                    console.log("Logged in");

                    next();
                }
            });
        } else {
            console.error("Missing login to login user");
        }
    } else {
        console.error("Missing data to register user");
    }
}

const props: IRegistration = {
    next,
    previous
}

</script>
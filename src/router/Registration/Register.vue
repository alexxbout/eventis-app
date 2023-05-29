<template>
    <div class="w-screen h-screen margins">
        <RegisterCode ref="registerCode" @@send-code="handleCode" v-if="currentStep == 1" />
        <RegisterCredentials ref="registerCredentials" @@send-credentials="handleCredentials" v-if="currentStep == 2" />
        <RegisterPicture v-if="currentStep == 3" />
        <RegisterFriends v-if="currentStep == 4" />

        <!-- <RegisterInterests /> -->

        <RegisterCongrats v-if="currentStep == 5" />
    </div>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";

import type { IRegistration } from "../../types/Register";
import type { IUser } from "../../types/User";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

import RegisterCode from "./RegisterCode.vue";
import RegisterCredentials from "./RegisterCredentials.vue";
import RegisterPicture from "./RegisterPicture.vue";
import RegisterFriends from "./RegisterFriends.vue";
import RegisterCongrats from "./RegisterCongrats.vue";
import RegisterInterests from "./RegisterInterests.vue";

// ########################################### VARIABLES ###########################################

const MAX_STEPS = 6;

const registerCode = ref<InstanceType<typeof RegisterCode>>();
const registerCredentials = ref<InstanceType<typeof RegisterCredentials>>();

const currentStep = ref(5);

const code = ref("");
const user = ref<IUser | null>(null);

// ########################################### HANDLERS ###########################################

const handleCode = (paramCode: string) => {
    code.value = paramCode;
}

const handleCredentials = (paramUser: IUser) => {
    user.value = paramUser;

    registerUser(user.value);
}

// ########################################### FUNCTIONS ###########################################

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

const registerUser = async (user: IUser) => {
    if (code.value && user.password) {

        const login = await UtilsApi.registerUser(code.value, user.firstname, user.lastname, user.password);

        if (login) {
            user.login = login;
        }

        if (user.login) {
            if (await UtilsAuth.login(user.login, user.password)) {
                next();
            }
        } else {
            console.error("Missing login to login user");
        }
    } else {
        console.error("Missing data to register user");
    }
}

provide("props",
    <IRegistration>{
        next,
        previous
    });

</script>
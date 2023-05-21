<template>
    <div class="h-screen w-screen">
        <RegisterCode ref="registerCode" @@send-code="handleCode" v-if="currentStep == 1" :data="props" />
        <RegisterCredentials ref="registerCredentials" @@send-credentials="handleCredentials" v-if="currentStep == 2" />

        <div v-if="currentStep == 3" class="w-20 h-20 bg-red-500"></div>
    </div>
</template>

<script setup lang="ts">
import type { IRegistration, IUser } from "../../types/interfaces";

import ApiService from "../../services/ApiService";

import RegisterCode from "./RegisterCode.vue";
import RegisterCredentials from "./RegisterCredentials.vue";

import { ref } from "vue";

// ########################################### Variables ###########################################
const MAX_STEPS = 6;

const registerCode = ref<InstanceType<typeof RegisterCode>>();
const registerCredentials = ref<InstanceType<typeof RegisterCredentials>>();

const currentStep = ref(1);

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

    if (code.value && user.value && user.value.password) {
        ApiService.registerUser(code.value, user.value.firstname, user.value.lastname, user.value.password).then((response) => {
            if (response.status == 200) {
                console.log(response.data);
                
                next();
            }
        });
    }
}

const props: IRegistration = {
    next,
    previous
}

</script>
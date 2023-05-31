<template>
    <form ref="form" @submit.prevent="handleSubmit" class="flex flex-col justify-around w-full h-full">
        <!-- Retour -->
        <div class="flex items-center justify-between w-full">
            <div @click.prevent="router.push({ name: 'home' })" class="flex gap-x-[10px] bg-[#F2F2F7] rounded-full py-2 px-5 w-max text-[#3C3C43]/60">
                <i class="bi bi-chevron-left"></i>
                <span>Retour</span>
            </div>

            <div v-if="loading">
                <Spinner />
            </div>
        </div>

        <!-- Code -->
        <div class="flex flex-col gap-y-14">
            <div class="flex flex-col gap-y-4">
                <span class="header">Entrez le code</span>
                <span class="text-gray-500">Saisissez votre code d’invitation fournit par votre éducateur.</span>
            </div>

            <div class="flex w-full justify-evenly gap-x-[10px]">
                <input v-for="index in codeLength" :key="index" :id="index.toString()" ref="inputs" @keypress="handleInput" @input="handleInput" type="text" maxlength="1" minlength="1" class="bg-[#F3F6FC] font-medium text-xl border-gray-200 text-center border-2 rounded-[14px] p-[10] h-[72px] w-[62px] appearance-none focus:outline-primary focus:outline-2 outline-none outline-offset-0" required>
            </div>
        </div>

        <!-- Suivant -->
        <div class="flex items-center justify-end w-full gap-x-5">
            <button :disabled="!readyToSubmit" class="w-1/2 btn-primary">
                <span>Suivant</span>
                <i class="text-xl bi bi-arrow-right-short"></i>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { PropType, inject, ref, } from "vue";
import { useRouter } from "vue-router";

import type { IRegistration } from "../../types/Register";
import { ICONS } from "../../types/Button";

import Spinner from "../../components/Spinner.vue";

import ApiService from "../../utils/UtilsApi";
import Button from "../../components/Button.vue";

// ########################################### VARIABLES ###########################################

const router = useRouter();

const form = ref<HTMLFormElement | null>();
const inputs = ref<HTMLInputElement[]>([]);

const codeLength = ref(5);
const loading = ref(false);
const readyToSubmit = ref(false);

const props = inject("props") as IRegistration;

// ########################################### EVENTS ###########################################

const emit = defineEmits(["@sendCode"]);

// ########################################### HANDLERS ###########################################

const handleInput = (event: Event) => {
    // Update submit button state
    readyToSubmit.value = getFormValidity();

    // Update inputs state
    if (!getFormValidity()) {
        setNeutreInputs();
    }

    // Focus next input if current input is not empty
    const input = event.target as HTMLInputElement;
    const inputIndex = inputs.value.indexOf(input);

    if (input.value.length > 0) {
        if (inputIndex < inputs.value.length - 1) {
            inputs.value[inputIndex + 1].focus();
        }
    }
}

const handleSubmit = async () => {
    if (getFormValidity()) {
        loading.value = true;

        const code = await ApiService.getCode(getCode());

        loading.value = false;

        if (code) {
            emit("@sendCode", code);

            setValidInputs();

            setTimeout(() => {
                props.next();
            }, 500);
        } else {
            setInvalidInputs();
        }
    }
}

// ########################################### FUNCTIONS ###########################################

const setValidInputs = () => {
    inputs.value.forEach((input) => {
        input.classList.add("valid-input");
        input.classList.remove("invalid-input");
    });
}

const setInvalidInputs = () => {
    inputs.value.forEach((input) => {
        input.classList.remove("valid-input");
        input.classList.add("invalid-input");
    });
}

const setNeutreInputs = () => {
    inputs.value.forEach((input) => {
        input.classList.remove("valid-input");
        input.classList.remove("invalid-input");
    });
}

const getCode = (): string => {
    let code = "";

    for (let i = 0; i < inputs.value.length; i++) {
        code += inputs.value[i].value;
    }

    return code;
}

const getFormValidity = (): boolean => {
    if (form.value) {
        return form.value.checkValidity();
    }

    return false;
}

</script>
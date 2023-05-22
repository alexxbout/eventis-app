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
            <button :disabled="!readyToSubmit" class="btn-primary w-1/2">
                <span>Suivant</span>
                <i class="text-xl bi bi-arrow-right-short"></i>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { IRegistration } from "../../types/interfaces";

import Spinner from "../../components/Spinner.vue";

import ApiService from "../../utils/UtilsApi";

import { useRouter } from "vue-router";
import { PropType, ref, } from "vue";

// ########################################### Variables ###########################################
const props = defineProps({
    data: {
        type: Object as PropType<IRegistration>,
        required: true
    }
});

const router = useRouter();

const form   = ref<HTMLFormElement | null>();
const inputs = ref<HTMLInputElement[]>([]);

const codeLength    = ref(5);
const loading       = ref(false);
const readyToSubmit = ref(false);

// ########################################### Evenements ###########################################
const emit = defineEmits(["@sendCode"]);

// ########################################### Fonctions ###########################################
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

const handleSubmit = async () => {
    if (getFormValidity()) {
        loading.value = true;

        const code = getCode();

        await ApiService.getCode(code).then((response) => {
            loading.value = false;

            if (response.status === 200) {
                emit("@sendCode", code);

                setValidInputs();

                setTimeout(() => {
                    props.data.next();
                }, 500);
            } else {
                setInvalidInputs();
            }
        });
    }
}

const getCode = (): string => {
    let code = "";

    for (let i = 0; i < inputs.value.length; i++) {
        code += inputs.value[i].value;
    }

    return code;
}

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

const getFormValidity = (): boolean => {
    if (form.value) {
        return form.value.checkValidity();
    }

    return false;
}

</script>
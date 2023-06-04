<template>
    <form ref="formElement" @submit.prevent="handleSubmit" class="flex flex-col justify-around w-full h-full">
        <!-- Retour -->
        <div class="flex items-center justify-between w-full">
            <i @click.prevent="router.push({ name: 'home' })" class="bi bi-arrow-left-short bg-[#F2F2F7] text-center flex items-center justify-center text-3xl text-[#3C3C43]/60 w-12 h-12 aspect-square rounded-full"></i>

            <object v-show="loading" class="w-10 h-10" :data="'/src/assets/spinner.svg'" type="image/svg+xml"></object>
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
        <Button :data="nextBtnStyle" />
    </form>
</template>

<script setup lang="ts">
import { PropType, computed, inject, ref, } from "vue";
import { useRouter } from "vue-router";

import type { IRegistration } from "../../types/Register";
import type { IButton } from "../../types/Button";

import ApiService from "../../utils/UtilsApi";
import Button from "../../components/Button.vue";

// ########################################### VARIABLES ###########################################

const props         = inject("props") as IRegistration;
const router        = useRouter();
const formElement   = ref<HTMLFormElement | null>();
const inputs        = ref<HTMLInputElement[]>([]);
const codeLength    = ref(5);
const loading       = ref(false);
const readyToSubmit = ref(false);
const nextBtnStyle  = computed<IButton>(() => {
    return {
        apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY' },
        text: 'Suivant',
        icon: {name: 'ARROW_RIGHT', side: 'RIGHT'},
        type: 'submit',
        disabled: !readyToSubmit.value
    }
});

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

const handleSubmit = () => {
    if (!loading.value && getFormValidity()) {
        loading.value = true;

        setTimeout(async () => {
            loading.value = false;

            const code = getCode();

            if (await ApiService.getCode(code)) {
                emit("@sendCode", code);

                setValidInputs();

                setTimeout(() => {
                    loading.value = false;
                    props.next();
                }, 1000);
            } else {
                setInvalidInputs();
            }
        }, 2000);
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
    if (formElement.value) {
        return formElement.value.checkValidity();
    }

    return false;
}

</script>
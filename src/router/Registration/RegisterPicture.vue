<template>
    <div class="flex flex-col justify-around w-full h-full">
        <div class="flex flex-col items-center justify-center w-full text-center gap-y-10">
            <span class="header">Ajouter votre photo</span>

            <label v-if="!success" class="aspect-square flex items-center justify-center h-[140px] w-[140px] rounded-full bg-[#ECF3FD]" for="image">
                <input ref="fileInput" @change="handleInput" type="file" class="hidden" id="image" name="image">

                <svg class="fill-primary" width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M39.5 18V30C39.6174 31.0133 39.5042 32.0401 39.1688 33.0035C38.8334 33.9669 38.2846 34.842 37.5632 35.5633C36.8419 36.2846 35.9668 36.8335 35.0034 37.1689C34.04 37.5042 33.0133 37.6174 32 37.5H7.99995C6.98663 37.6174 5.95987 37.5042 4.99648 37.1689C4.03308 36.8335 3.15799 36.2846 2.43667 35.5633C1.71535 34.842 1.16647 33.9669 0.831087 33.0035C0.495704 32.0401 0.382503 31.0133 0.499951 30V10C0.382503 8.98668 0.495704 7.95992 0.831087 6.99653C1.16647 6.03313 1.71535 5.15804 2.43667 4.43672C3.15799 3.7154 4.03308 3.16652 4.99648 2.83114C5.95987 2.49575 6.98663 2.38255 7.99995 2.5H22C22.3978 2.5 22.7793 2.65804 23.0606 2.93934C23.3419 3.22064 23.5 3.60218 23.5 4C23.5 4.39782 23.3419 4.77936 23.0606 5.06066C22.7793 5.34196 22.3978 5.5 22 5.5H7.99995C4.84595 5.5 3.49995 6.846 3.49995 10V28.5L8.57995 23.42C8.95757 23.0453 9.46798 22.835 9.99995 22.835C10.5319 22.835 11.0423 23.0453 11.42 23.42L13.2999 25.3C13.4869 25.4832 13.7382 25.5859 14 25.5859C14.2617 25.5859 14.513 25.4832 14.7 25.3L24.58 15.42C24.9576 15.0453 25.468 14.835 26 14.835C26.5319 14.835 27.0423 15.0453 27.42 15.42L36.5 24.5V18C36.5 17.6022 36.658 17.2206 36.9393 16.9393C37.2206 16.658 37.6021 16.5 38 16.5C38.3978 16.5 38.7793 16.658 39.0606 16.9393C39.3419 17.2206 39.5 17.6022 39.5 18ZM11.986 11.5C11.3219 11.5019 10.6858 11.7672 10.2172 12.2377C9.74868 12.7082 9.48603 13.3455 9.48695 14.0095C9.48788 14.6735 9.75231 15.31 10.2222 15.7792C10.692 16.2484 11.3289 16.512 11.993 16.512C12.657 16.512 13.2939 16.2484 13.7637 15.7792C14.2336 15.31 14.498 14.6735 14.4989 14.0095C14.4999 13.3455 14.2372 12.7082 13.7687 12.2377C13.3001 11.7672 12.664 11.5019 12 11.5H11.986ZM30 7.5H32.5V10C32.5 10.3978 32.658 10.7794 32.9393 11.0607C33.2206 11.342 33.6021 11.5 34 11.5C34.3978 11.5 34.7793 11.342 35.0606 11.0607C35.3419 10.7794 35.5 10.3978 35.5 10V7.5H38C38.3978 7.5 38.7793 7.34196 39.0606 7.06066C39.3419 6.77936 39.5 6.39782 39.5 6C39.5 5.60218 39.3419 5.22064 39.0606 4.93934C38.7793 4.65804 38.3978 4.5 38 4.5H35.5V2C35.5 1.60218 35.3419 1.22064 35.0606 0.93934C34.7793 0.658035 34.3978 0.5 34 0.5C33.6021 0.5 33.2206 0.658035 32.9393 0.93934C32.658 1.22064 32.5 1.60218 32.5 2V4.5H30C29.6021 4.5 29.2206 4.65804 28.9393 4.93934C28.658 5.22064 28.5 5.60218 28.5 6C28.5 6.39782 28.658 6.77936 28.9393 7.06066C29.2206 7.34196 29.6021 7.5 30 7.5Z" />
                </svg>
            </label>

            <div v-if="success" class="relative">
                <UserProfilPicture :data="{pic: pic, style: 'BIG'}" />

                <i @click="handleRemovePicture" class="absolute flex items-center justify-center w-12 h-1w-12 text-xl rounded-full bi bi-trash-fill -bottom-2 aspect-square -right-2 text-custom-red bg-[#F6F6F6]"></i>
            </div>
        </div>

        <!-- Suivant -->
        <Button @@click="props.next()" :data="nextBtnStyle" />
    </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";

import UserProfilPicture from "../app/users/UserProfilPicture.vue";
import Button from "../../components/Button.vue";

import UtilsAuth from "../../utils/UtilsAuth";
import UtilsApi from "../../utils/UtilsApi";

import type { IButton, IRegistration } from "../../types/interfaces";

// ########################################### VARIABLES ###########################################

const props        = inject("props") as IRegistration;
const fileInput    = ref<HTMLInputElement | null>(null);
const success      = ref(false);
const pic          = ref("");
const user         = UtilsAuth.getCurrentUser();

const nextBtnStyle = ref<IButton>({
    apparence: { color: 'BLUE', size: 'BASE', type: 'PRIMARY' },
    text: 'Suivant',
    icon: { name: 'ARROW_RIGHT', side: 'RIGHT' },
});

// ########################################### HANDLERS ###########################################

const handleInput = async () => {
    if (fileInput.value?.files) {
        const formData = new FormData();
        formData.append("image", fileInput.value.files[0]);

        const file = await UtilsApi.updateUserPicture(user!.id, formData);

        if (file) {
            pic.value = file;
            success.value = true;
        } else {
            success.value = false;
        }
    } else {
        console.error("File not found");
    }
}

const handleRemovePicture = async () => {
    if (await UtilsApi.removeUserPicture(user!.id)) {
        pic.value = "";
        success.value = false;
    }
}
</script>
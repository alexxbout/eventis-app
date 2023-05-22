<template>
    <div class="h-[137px] w-full max-w-xs rounded-[13px] bg-[#FAFAFA] p-[13px] flex flex-col gap-y-[10px]">

        <!-- Picture + button -->
        <div class="flex items-center justify-between w-full gap-x-2">

            <div v-if="props.data.pic" class="bg-no-repeat rounded-full w-[60px] h-[60px] bg-center bg-cover" :style="{ backgroundImage: 'url(' + 'http://localhost:8080/image/users/' + props.data.pic + ')' }"></div>

            <div v-else class="rounded-full w-[60px] h-[60px] bg-[#ECF3FD] flex items-center justify-center">
                <i class="text-2xl bi bi-person-fill"></i>
            </div>

            <Button @@trigger="handleClick(props.data.id)" :data="{ color: 'BLUE', size: 'XS', type: 'PRIMARY', text: 'Ajouter' }" />
        </div>

        <!-- Name / Pseudo -->
        <div class="font-bold text-[14px]">
            <span>{{ props.data.firstname + " " + props.data.lastname }}</span>
        </div>

        <!-- Interets -->
        <div></div>
    </div>
</template>

<script setup lang="ts">
import Button from "../Button.vue";

import { PropType, onMounted, ref } from "vue";

import type IUser from "../../types/User";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ############################################## Variables ##############################################
const props = defineProps({
    data: {
        type: Object as PropType<IUser>,
        required: true
    }
});

// ############################################## Fonctions ##############################################
const handleClick = (idUser: number) => {
    const user = UtilsAuth.getCurrentUser();
    if (user) {
        UtilsApi.askFriend(user.id, props.data.id).then((response) => {
            if (response.status === 201) {
            }
            else {
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}

</script>
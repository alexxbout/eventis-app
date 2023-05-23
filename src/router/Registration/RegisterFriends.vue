<template>
    <div class="flex flex-col justify-around w-full h-full">
        <!-- Retour -->
        <div class="flex items-center w-full">
            <div @click.prevent="props.data.previous" class="flex gap-x-[10px] bg-[#F2F2F7] rounded-full py-2 px-5 w-max text-[#3C3C43]/60">
                <i class="bi bi-chevron-left"></i>
                <span>Retour</span>
            </div>
        </div>

        <!-- Friends -->
        <div class="flex flex-col h-3/5 gap-y-14">
            <span class="header">Restez connectés avec vos amis</span>

            <!-- UserCard -->
            <div class="grid w-full h-full gap-3 overflow-hidden overflow-y-auto 2xs:grid-cols-1 xs:grid-cols-2 place-items-center">
                <UserCard v-for="card in users" :data="card" :hideFriends="true" />
            </div>
        </div>

        <!-- Suivant -->
        <div class="flex items-center justify-end w-full gap-x-5">
            <button class="w-1/2 btn-primary">
                <span>Suivant</span>
                <i class="text-xl bi bi-arrow-right-short"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from "vue";

import UserCard from "../../components/user/UserCard.vue";

import type { IUser } from "../../types/User";
import { IRegistration } from "../../types/interfaces";
import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";

// ############################################## Variables ##############################################
const props = defineProps({
    data: {
        type: Object as PropType<IRegistration>,
        required: true
    }
});

const users = ref<IUser[]>([]);

// ############################################## Fonctions ##############################################
onMounted(async () => {
    const user = UtilsAuth.getCurrentUser();

    if (user) {
        const idFoyer = user.idFoyer;

        if (idFoyer) {
            await UtilsApi.getUsersByFoyer(idFoyer)
                .then((response) => {
                    users.value = response.data.data;
                    
                    // Enlève l'utilisateur courant de la liste
                    removeUser(user.id);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
});

const removeUser = (id: number) => {
    const index = users.value.findIndex((user) => user.id === id);

    if (index !== -1) {
        users.value.splice(index, 1);
    }
}

</script>
<template>
    <div class="w-full h-max flex items-center justify-between gap-x-5 bg-[#FAFAFA] p-[13px] rounded-[18px]">
        
        <!-- User name + Picture -->
        <div class="flex items-center justify-center w-max gap-x-5">
            <UserProfilPicture :data="{ pic: props.data.user.pic, style: 'SMALL' }" />

            <span class="text-base font-medium">{{ props.data.user.firstname + ' ' + props.data.user.lastname }}</span>
        </div>

        <!-- Action -->
        <Button @@click="handleClick" class="w-max" :data="props.button" />
    </div>
</template>
  
<script setup lang="ts">
import { PropType } from "vue";

import type { IUser, IButton } from "../types/interfaces";

import Button from "./Button.vue";
import UserProfilPicture from "./UserProfilPicture.vue";

// ########################################### VARIABLES ###########################################

const props = defineProps({
    data: {
        type: Object as PropType<{
            user: IUser
        }>,
        required: true,
    },
    button: {
        type: Object as PropType<IButton>,
        required: true
    }
});

// ########################################### FUNCTIONS ###########################################

// ########################################### EVENTS ###########################################

const emit = defineEmits(["@click"]);

// ########################################### HANDLERS ###########################################

const handleClick = () => {
    emit("@click");
}
</script>
  
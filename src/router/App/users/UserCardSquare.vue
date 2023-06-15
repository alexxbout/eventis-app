<template>
    <div ref="container" class="h-max w-full max-w-xs rounded-[18px] bg-[#FAFAFA] p-[13px] flex flex-col gap-y-[10px] overflow-hidden">
        <!-- Picture + button -->
        <div class="flex items-center justify-between w-full gap-x-2">
            <UserProfilPicture :data="{ pic: props.data.user.pic, style: 'MEDIUM'}" />
            <Button @@click="handleClick" :data="props.button" :delay="1200" />
        </div>

        <!-- Name / Pseudo -->
        <div class="text-base font-semibold">
            <span>{{ props.data.user.firstname + ' ' + props.data.user.lastname }}</span>
        </div>

        <!-- Interests -->
        <div class="flex gap-x-3 h-max">
            <div v-if="props.data.interests.length == 0" class="text-sm font-medium text-transparent">No data</div>
            <div v-else v-for="interest in props.data.interests" class="flex items-center justify-center text-sm font-medium text-gray-400 gap-x-1 w-max">
                <Emoji :data="{ name: interest.emoji, size: 'INTEREST' }" />
                <span class="whitespace-nowrap">{{ interest.name }}</span>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { PropType } from "vue";

import type { IUser, IButton, IInterest } from "../../../types/interfaces";

import Button from "../../../components/Button.vue";
import UserProfilPicture from "./UserProfilPicture.vue";
import Emoji from "../../../components/Emoji.vue";

// ########################################### VARIABLES ###########################################

const props = defineProps({
    data: {
        type: Object as PropType<{
            user: IUser,
            interests: IInterest[]
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
  
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
            <div v-if="props.data.interests.length == 0" class="font-medium text-sm text-transparent">No data</div>
            <div v-else v-for="interest in props.data.interests" class="flex gap-x-1 items-center justify-center text-gray-400 font-medium text-sm w-max">
                <Emoji :data="{ name: interest.emoji, size: 'XS' }" />
                <span class="whitespace-nowrap">{{ interest.name }}</span>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { PropType } from "vue";

import type { IUser } from "../types/User";
import type { IButton } from "../types/Button";
import type { IInterest } from "../types/Interest";

import Button from "./Button.vue";
import UserProfilPicture from "./UserProfilPicture.vue";
import Emoji from "./Emoji.vue";

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
  
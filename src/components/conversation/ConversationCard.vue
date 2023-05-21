<template>
    <div class="flex w-full max-w-full bg-custom-light-gray rounded-2xl p-3 place-items-center justify-between overflow-hidden">
        <!-- Left -->
        <div class="flex gap-x-5 shrink-0 w-5/6">
            <!-- Picture -->
            <img v-if="props.data.userAvatar" class="aspect-square w-14 h-14 rounded-full" :src="props.data.userAvatar" alt="">
            <div v-else class="aspect-square w-14 h-14 rounded-full bg-custom-light-blue flex items-center justify-center">
                <i class="bi bi-person-fill text-2xl"></i>
            </div>

            <!-- User name + last message -->
            <div class="flex flex-col gap-y-2 overflow-hidden w-full">
                <span class="font-semibold text-base">{{ props.data.userFullName }}</span>
                <span class="font-light truncate text-gray-500">{{ props.data.lastMessage }}</span>
            </div>
        </div>

        <!-- Right -->
        <!-- Hour + nb unread messages -->
        <div class="flex flex-col gap-y-2 justify-self-end w-1/6">
            <!-- Hour -->
            <span class="text-right font-light text-gray-500">{{ props.data.lastMessageTime }}</span>

            <!-- Nb unread messages -->
            <div v-if="props.data.nbUnreadMessages > 0" class="rounded-full bg-custom-red-alert w-6 h-6 flex items-center justify-center aspect-square text-white text-center place-self-end">
                <span v-if="props.data.nbUnreadMessages <= 99" class="text-xs font-medium">{{ props.data.nbUnreadMessages }}</span>
                <i v-else class="bi bi-fire"></i>
            </div>

            <!-- No unread messages -->
            <div v-else class="place-self-end">
                <i class="bi bi-check2-all text-custom-green text-xl"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IConversationCard } from "../../types/interfaces";

import { PropType } from "vue";

const props = defineProps({
    data: {
        type: Object as PropType<IConversationCard>,
        required: true
    }
});

</script>
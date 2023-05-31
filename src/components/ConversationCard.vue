<template>
    <div class="flex justify-between w-full max-w-full p-3 overflow-hidden bg-custom-light-gray rounded-2xl place-items-center">
        <!-- Left -->
        <div class="flex w-5/6 gap-x-5 shrink-0">
            <!-- Picture -->
            <img v-if="props.data.userAvatar" class="rounded-full aspect-square w-14 h-14" :src="props.data.userAvatar" alt="">
            <div v-else class="flex items-center justify-center rounded-full aspect-square w-14 h-14 bg-custom-light-blue">
                <i class="text-2xl bi bi-person-fill"></i>
            </div>

            <!-- User name + last message -->
            <div class="flex flex-col w-full overflow-hidden gap-y-2">
                <span class="text-base font-semibold">{{ props.data.userFullName }}</span>
                <span class="font-light text-gray-500 truncate">{{ props.data.lastMessage }}</span>
            </div>
        </div>

        <!-- Right -->
        <!-- Hour + nb unread messages -->
        <div class="flex flex-col w-1/6 gap-y-2 justify-self-end">
            <!-- Hour -->
            <span class="font-light text-right text-gray-500">{{ props.data.lastMessageTime }}</span>

            <!-- Nb unread messages -->
            <div v-if="props.data.nbUnreadMessages > 0" class="flex items-center justify-center w-6 h-6 text-center text-white rounded-full bg-custom-red-alert aspect-square place-self-end">
                <span v-if="props.data.nbUnreadMessages <= 99" class="text-xs font-medium">{{ props.data.nbUnreadMessages }}</span>
                <i v-else class="bi bi-fire"></i>
            </div>

            <!-- No unread messages -->
            <div v-else class="place-self-end">
                <i class="text-xl bi bi-check2-all text-custom-green"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IConversationCard } from "../types/ConversationCard";

import { PropType } from "vue";

const props = defineProps({
    data: {
        type: Object as PropType<IConversationCard>,
        required: true
    }
});

</script>
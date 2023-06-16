<template>
    <div class="flex flex-col mb-20 gap-y-8 margins">
        <!-- Header -->
        <div class="flex items-center w-full">
            <div class="flex gap-x-[15px] items-center justify-between w-max">
                <span class="header">Messages</span>
            </div>
        </div>

        <div class="flex flex-col gap-y-5">
            <ConversationCard @click="handleClick" v-for="conv in conversations" :data="conv" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { IConversationCard } from "../../types/interfaces";

import ConversationCard from "../../components/ConversationCard.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const conversations = ref<IConversationCard[]>([
    {
        userFullName: "John Doe",
        lastMessage: "Hello, comment vas-tu ?",
        lastMessageTime: "12:00",
        nbUnreadMessages: 1,
        userAvatar: "https://i.pravatar.cc/150?img=68"
    }
]);

const handleClick = () => {
    router.push("/messages/1");
};
</script>
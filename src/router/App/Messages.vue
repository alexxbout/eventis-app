<template>
    <div class="flex flex-col mb-20 gap-y-8 margins">
        <!-- Header -->
        <div class="flex items-center w-full">
            <div class="flex gap-x-[15px] items-center justify-between w-max">
                <!-- <i class="text-[27px] bi bi-chat"></i> -->
                <span class="header">Messages</span>
            </div>
        </div>

        <ConversationCard v-for="conv in conversations" :data="conv" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { IConversationCard } from "../../types/ConversationCard";

import ConversationCard from "../../components/ConversationCard.vue";

const conversations = ref<IConversationCard[]>([
    {
        userFullName: "Lila Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 1,
        userAvatar: "https://i.pravatar.cc/150?img=68"
    },
    {
        userFullName: "Alex Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 20,
        userAvatar: "https://i.pravatar.cc/150?img=49"
    },
    {
        userFullName: "Philippe Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 99,
        userAvatar: "https://i.pravatar.cc/150?img=45"
    },
    {
        userFullName: "Popo Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 100,
        userAvatar: "https://i.pravatar.cc/150?img=8"
    },
    {
        userFullName: "Seb Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 0,
        userAvatar: "https://i.pravatar.cc/150?img=10"
    },
    {
        userFullName: "Random Doe",
        lastMessage: "Je suis un message",
        lastMessageTime: "12:00",
        nbUnreadMessages: 0
    },
    {
        userFullName: "John Doe",
        lastMessage: "Je suis un message",
        lastMessageTime: "12:00",
        nbUnreadMessages: 0
    }
]);
</script>
<template>
    <div class="flex flex-col gap-y-10 mb-20">
        <span class="header">Messages</span>

        <ConversationCard v-for="conv in conversations" :data="conv" />
    </div>

    <!-- <div v-for="conv in conversations">

    </div> -->
</template>

<script setup lang="ts">
import type { IConversationCard } from "../types/interfaces";

import ConversationCard from "../components/ConversationCard.vue";
import { ref } from "vue";

const conversations = ref<IConversationCard[]>([
    {
        userFullName: "Lila Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 1,
        userAvatar: "https://i.pravatar.cc/150?img=68"
    },
    {
        userFullName: "Lila Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 20,
        userAvatar: "https://i.pravatar.cc/150?img=49"
    },
    {
        userFullName: "Lila Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 99,
        userAvatar: "https://i.pravatar.cc/150?img=45"
    },
    {
        userFullName: "Lila Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 100,
        userAvatar: "https://i.pravatar.cc/150?img=8"
    },
    {
        userFullName: "Lila Doe",
        lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        lastMessageTime: "12:00",
        nbUnreadMessages: 0,
        userAvatar: "https://i.pravatar.cc/150?img=10"
    },
    {
        userFullName: "John Doe",
        lastMessage: "Je suis un message",
        lastMessageTime: "12:00",
        nbUnreadMessages: 0
    },
    {
        userFullName: "John Doe",
        lastMessage: "Je suis un message",
        lastMessageTime: "12:00",
        nbUnreadMessages: 0
    },
    {
        userFullName: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        lastMessage: "",
        lastMessageTime: "12:00",
        nbUnreadMessages: 0
    }
]);
</script>
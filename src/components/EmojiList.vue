<template>
    <div class="h-max max-h-[300px] flex flex-wrap shadow-card items-center gap-2 bg-white rounded-[30px] p-3 overflow-hidden overflow-y-auto">
        <Emoji v-for="emoji in emojis" @click="handleEmojiSelect(emoji)" :data="{ name: emoji, size: 'DEFAULT' }" :fast-mode="true" class="z-50" />
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref } from "vue";
import UtilsApi from "../utils/UtilsApi";
import Emoji from "./Emoji.vue";

const emojis = ref<string[]>([]);
const emit = defineEmits(["@select"]);

onMounted(async () => {
    emojis.value = await UtilsApi.getEmojis();
});

const handleEmojiSelect = (emoji: string) => {
    console.log(emoji);
    
    emit("@select", emoji);
};

</script>
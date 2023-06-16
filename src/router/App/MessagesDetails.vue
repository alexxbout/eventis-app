<template>
    <div class="h-screen w-screen relative max-h-screen flex justify-between flex-col">
        <!-- Header -->
        <div class="w-screen flex items-center justify-between bg-white p-5 border-b py-7">
            <div @click="router.push({name : 'messages'})">
                <i class="bi bi-chevron-left text-2xl"></i>
            </div>

            <div class="flex gap-x-2 items-center justify-center w-max">
                <img class="rounded-full aspect-square w-9 h-9" src="https://i.pravatar.cc/150?img=68" alt="">
                <div class="text-xl font-semibold">John Doe</div>
            </div>

            <div>
                <i class="bi bi-exclamation-circle text-custom-red text-2xl"></i>
            </div>
        </div>

        <div ref="container" class="w-full h-full overflow-y-auto overflow-hidden pt-20 bg-[#FAFAFA] p-5 flex flex-col gap-y-5">
            <div v-for="message in messages" class="w-full h-max flex flex-col">
                <div v-if="message.isSender" class="rounded-xl rounded-br-none bg-white w-max p-3 place-self-end max-w-xs">
                    <span>{{ message.content }}</span>
                </div>

                <div v-else class="rounded-xl rounded-bl-none bg-primary w-max p-3 text-white max-w-xs">
                    <span>{{ message.content }}</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="w-screen flex items-center justify-center bg-white p-5 border-b py-7 border-t gap-x-4 h-max">
            <div class="w-full p-4 bg-[#F6F6F6] text-[#A2A2A2]  rounded-full">
                <span>Votre message...</span>
            </div>

            <div class="bg-primary aspect-square h-12 w-12 text-center flex items-center justify-center rounded-full">
                <i class="bi bi-send-fill text-xl text-white"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

interface IMessage {
    isSender: boolean;
    content: string;
};

const messages = ref<IMessage[]>([
    {isSender: true, content: "Salut !"},
    {isSender: false, content: "Salut ! Comment vas-tu ?"},
    {isSender: true, content: "Bien et toi ?"},
    {isSender: false, content: "Bien merci !"},
    {isSender: true, content: "Tu fais quoi de beau ?"},
    {isSender: false, content: "Je suis en train de coder une messagerie instantanée !"},
    {isSender: true, content: "Ah ouais ? C'est cool !"},
    {isSender: false, content: "Oui !"},
    {isSender: true, content: "Tu veux voir ?"},
    {isSender: false, content: "Oui !"},
    {isSender: false, content: "C'est super !"},
    {isSender: true, content: "Content que ça te plaise !"},
    {isSender: false, content: "A plus !"},
    {isSender: false, content: "Hello, comment vas-tu ?"},
]);

const container = ref<HTMLElement | null>(null);

const router = useRouter();

onMounted(() => {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
});

</script>
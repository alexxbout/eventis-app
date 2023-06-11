<template>
    <div class="h-full">

        <div v-show="showEmojis" @click="showEmojis = false" class="absolute inset-0 h-screen w-screen bg-white/80 backdrop-blur z-20"></div>

        <div v-show="!showEmojis" class="fixed bottom-0 flex w-full h-20 p-4 bg-white border-t gap-x-3 z-10">
            <Button @@click="handleSubmit" class="w-full" :data="submitBtnStyle" :delay="1000" />
        </div>

        <div class="margins flex flex-col gap-y-14 mb-20">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i @click="router.push({ name: 'settings' })" class="bi bi-arrow-left-short back"></i>

                <!-- <i class="text-[27px] bi bi-person-vcard-fill"></i> -->
                <span class="header">Informations perso.</span>
            </div>

            <div class="flex flex-col w-full gap-y-10">
                <Input @@update="updateLastname" :name="'lastname'" :label="'Nom'" :minlength="3" :maxlength="30" :value="user.lastname" />

                <Input @@update="updateFirstname" :name="'firstname'" :label="'Prénom'" :minlength="3" :maxlength="30" :value="user.firstname" />

                <div class="flex justify-between items-center w-full h-max">
                    <div class="flex flex-col">
                        <span>Afficher le pseudo</span>
                        <span class="text-sm text-gray-500">Le pseudo sera affiché au lieu du nom</span>
                    </div>

                    <Switch @@update="handleSwitch" :value="user.showPseudo == '1'" />
                </div>

                <div v-show="user.showPseudo == '1'" class="relative z-30 h-max">
                    <Input @@update="updatePseudo" :name="'pseudo'" :label="'Pseudo'" :minlength="3" :maxlength="15" :value="user.pseudo">
                    <button @click="handleEmojiPicker" class="bg-[#F3F6FC] rounded-2xl p-4 h-[56px] w-[56px] aspect-square touch-manipulation">
                        <i v-if="user.emoji == null" class="bi bi-emoji-smile-fill text-xl text-primary"></i>
                        <i v-else class="bi bi-trash-fill text-xl text-custom-red"></i>
                    </button>
                    </Input>

                    <EmojiList @@select="handleEmojiSelect" v-show="showEmojis" class="absolute inset-y-24 w-full z-30" />
                </div>

                <Input @@update="updateBio" :name="'bio'" :label="'Bio'" :apparence="'textarea'" :maxlength="135" :value="user.bio" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Input from "../../components/Input.vue";
import Button from "../../components/Button.vue";
import { ref } from "vue";
import UtilsAuth from "../../utils/UtilsAuth";
import Switch from "../../components/Switch.vue";
import EmojiList from "../../components/EmojiList.vue";
import UtilsApi from "../../utils/UtilsApi";
import type { IUser, IButton } from "../../types/interfaces";

const router = useRouter();
const user = ref(UtilsAuth.getCurrentUser()!);

const showEmojis = ref(false);

const defaultStyle = ref<IButton>({ apparence: { color: "BLUE", size: "BASE", type: "PRIMARY" }, text: "Enregistrer" });
const successStyle = ref<IButton>({ apparence: { color: "GREEN", size: "BASE", type: "PRIMARY" }, text: "Informations enregistrées", icon: { name: 'SUCCESS', side: 'RIGHT' } });
const errorStyle = ref<IButton>({ apparence: { color: "RED", size: "BASE", type: "PRIMARY" }, text: "Erreur lors de l'enregistrement" });

const submitBtnStyle = ref<IButton>(defaultStyle.value);

const updateLastname = (value: string) => {
    user.value.lastname = value;
};

const updateFirstname = (value: string) => {
    user.value.firstname = value;
};

const updateBio = (value: string) => {
    user.value.bio = value;
};

const updatePseudo = (value: string) => {
    user.value.pseudo = value;
};

const handleSwitch = (value: boolean) => {
    user.value.showPseudo = value ? "1" : "0";
};

const handleEmojiPicker = () => {
    if (user.value.emoji != null) {
        user.value.emoji = null;
    } else {
        showEmojis.value = !showEmojis.value;
    }
};

const handleEmojiSelect = (newEmoji: string) => {
    user.value.emoji = newEmoji;
    showEmojis.value = false;
};

const handleSubmit = async () => {
    submitBtnStyle.value = defaultStyle.value;    

    const status = await UtilsApi.updateUser(
        user.value.id,
        user.value.firstname,
        user.value.lastname,
        user.value.emoji,
        user.value.pseudo,
        user.value.showPseudo,
        user.value.bio
    );

    if (status) {
        submitBtnStyle.value = successStyle.value;

        // Update user in local storage
        const item: {user: IUser} = JSON.parse(localStorage.getItem("app") || "{}");

        item.user = user.value;

        localStorage.setItem("app", JSON.stringify(item));
    } else {
        submitBtnStyle.value = errorStyle.value;
    }
}
</script>
<template>
    <div v-if="props.pic" class="bg-center bg-no-repeat bg-cover rounded-full aspect-square" :style="{
            backgroundImage: 'url(' + UtilsApi.getImage('users', props.pic) + ')',
            width: getSize(),
            height: getSize()
        }"></div>
        
    <div v-else class="flex items-center justify-center rounded-full aspect-square bg-[#ECF3FD]" :style="{
            width: getSize(),
            height: getSize()
        }">
        <i class="text-2xl bi bi-person-fill"></i>
    </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

import type { IUserProfilPicture } from "../../types/UserProfilPicture";
import { EUserProfilPictureStyle } from "../../types/UserProfilPicture";
import UtilsApi from "../../utils/UtilsApi";

const props = defineProps({
    pic: {
        type: String
    },
    size: {
        type: Object as PropType<IUserProfilPicture>,
        required: false,
        default: EUserProfilPictureStyle.MEDIUM
    }
});

const getSize = (): string => {
    switch (props.size.size) {
        case EUserProfilPictureStyle.SMALL: // UserCard inline
            return "45px";
        case EUserProfilPictureStyle.MEDIUM: // UserCard default
            return "60px";
        case EUserProfilPictureStyle.LARGE: // Profil / Settings
            return "90px";
        case EUserProfilPictureStyle.BIG: // Add picture / Profil of another user
            return "140px";
    }
};

</script>
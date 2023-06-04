<template>
    <button @click="handleClick" :class="props.selected ? 'bg-[#F1FBE9]' : 'bg-[#ECF1F9]'" class="flex items-center justify-between w-full px-3 py-4 overflow-hidden transition-colors duration-200 h-max rounded-xl disabled:grayscale" :disabled="props.disabled">
        <!-- Emoji + interest name -->
        <div class="flex items-center justify-center gap-x-2 w-max grow-0">
            <Emoji :data="{ name: props.data.emoji, size: 'BASE' }" />
            <span class="text-lg font-semibold whitespace-nowrap">{{ props.data.name }}</span>
        </div>

        <!-- Action button -->
        <div :style="{ 'color': props.selected ? '#69AF31' : '#166CF7' }" class="text-2xl w-max">
            <!-- Add -->
            <i v-if="!props.selected" class="bi bi-plus-circle-fill"></i>

            <!-- Remove -->
            <i v-else class="bi bi-check-circle-fill"></i>
        </div>
    </button>
</template>

<script setup lang="ts">
import { PropType} from "vue";
import { IInterest } from "../types/Interest";
import Emoji from "./Emoji.vue";

const props = defineProps({
    data: {
        type: Object as PropType<IInterest>,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["@click"]);

const handleClick = () => {
    if (props.disabled) return;
    
    emit("@click", props.data.id);
}

</script>
<template>
    <button @click="handleClick" :class="selected ? 'bg-[#F1FBE9]' : 'bg-[#ECF1F9]'" class="w-full h-max px-3 py-4 rounded-xl flex items-center justify-between transition-colors duration-200 overflow-hidden disabled:grayscale" :disabled="props.disabled">
        <!-- Emoji + interest name -->
        <div class="flex gap-x-2 items-center justify-center w-max grow-0">
            <Emoji :data="{ name: props.data.emoji, size: 'BASE' }" />
            <span class="font-semibold text-lg whitespace-nowrap">{{ props.data.name }}</span>
        </div>

        <!-- Action button -->
        <div :style="{ 'color': selected ? '#69AF31' : '#166CF7' }" class="text-2xl w-max">
            <!-- Add -->
            <i v-if="!selected" class="bi bi-plus-circle-fill"></i>

            <!-- Remove -->
            <i v-else class="bi bi-check-circle-fill"></i>
        </div>
    </button>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from "vue";
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

const selected = computed<boolean>(() => props.selected);

const disabled = computed<boolean>(() => props.disabled);

const emit = defineEmits(["@click"]);

// const setHasInterest = (value: boolean) => {
//     hasInterest.value = value;
// }

const handleClick = () => {
    if (disabled.value) return;
    
    emit("@click", props.data.id);
}

// defineExpose({
//     setHasInterest
// });

</script>
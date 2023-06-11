<template>
    <label class="flex justify-between items-center p-2 text-xl">
        <input type="checkbox" v-model="input" class="appearance-none peer" :checked="props.value" />
        <span class="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-primary after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
    </label>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
    value: {
        type: Boolean,
        default: false
    }
});

const input = ref();

const emit = defineEmits(["@update"]);

watch(input, (value) => {
    emit("@update", value);
});

</script>
<template>
    <div class="flex flex-col gap-y-[6px] w-full h-max">
        <label :for="props.name">{{ props.label }}</label>
        <div class="flex gap-x-2 w-full">
            <slot></slot>
            <input v-if="props.apparence == 'input'" class="bg-[#F3F6FC] rounded-2xl p-4 w-full" v-model="value" :name="props.name" :id="props.name" :placeholder="props.placeholder" :pattern="props.pattern" :minlength="props.minlength" :maxlength="props.maxlength" :type="props.type">
            <textarea v-else-if="props.apparence == 'textarea'" class="bg-[#F3F6FC] rounded-2xl p-4 min-h-[125px] w-full" v-model="value" :name="props.name" :id="props.name" :placeholder="props.placeholder" :pattern="props.pattern" :minlength="props.minlength" :maxlength="props.maxlength" type="text">{{ props.value }}</textarea>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    apparence: {
        type: String as PropType<"input" | "textarea">,
        default: "input"
    },
    type: {
        type: String as PropType<"text" | "password">,
        default: "text"
    },
    value: {
        type: String,
        default: ""
    },
    placeholder: {
        type: String,
        default: ""
    },
    pattern: {
        type: String,
        default: ""
    },
    minlength: {
        type: Number,
        default: 0
    },
    maxlength: {
        type: Number,
        default: -1
    }
});

const value = computed({
    get() {
        return props.value
    },
    set(value) {
        emit("@update", value)
    }
})

const emit = defineEmits(["@update"]);

defineExpose({
    value
});

</script>
<template>
    <div class="flex flex-col gap-y-[6px] w-full h-max">
        <label :for="props.name">{{ props.label }}</label>
        <div class="flex gap-x-2 w-full">
            <slot></slot>
            <input v-if="props.apparence == 'input'" ref="inputElement" class="bg-[#F3F6FC] rounded-2xl p-4 w-full input" v-model="value" :name="props.name" :id="props.name" :placeholder="props.placeholder" :pattern="props.pattern" :minlength="props.minlength" :maxlength="props.maxlength" :type="props.type" :required="props.required">
            <textarea v-else-if="props.apparence == 'textarea'" class="bg-[#F3F6FC] rounded-2xl p-4 min-h-[125px] w-full input" v-model="value" :name="props.name" :id="props.name" :placeholder="props.placeholder" :minlength="props.minlength" :maxlength="props.maxlength" :required="props.required" type="text">{{ props.value }}</textarea>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, ref } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: false
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

const emit = defineEmits(["@update"]);

const value = computed({
    get() {
        return props.value
    },
    set(value) {
        emit("@update", value)
    }
});

const inputElement = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (props.pattern == ""){
        inputElement.value?.removeAttribute("pattern");
    }
});

</script>
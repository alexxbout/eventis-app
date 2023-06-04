<template>
    <button @click="handleClick" :type="props.data.type" :style="style" :disabled="props.data.disabled" class="flex items-center justify-center text-sm font-semibold text-center text-white gap-x-2">

        <i v-if="props.data.icon" :class="getIconByName(props.data.icon.name) + ' ' + (props.data.icon.side == 'RIGHT' ? 'order-last' : 'order-first')" class="text-2xl"></i>

        <span>{{ props.data.text }}</span>
    </button>
</template>
  
<script setup lang="ts">
import { PropType, StyleValue, computed, ref } from "vue";

import type { IButton } from "../types/Button";
import { getIconByName } from "../types/Button";

// ############################################### VARIABLES ###############################################

const props = defineProps({
    data: {
        type: Object as PropType<IButton>,
        default: <IButton>{
            apparence: {
                type: "PRIMARY",
                color: "BLUE",
                size: "BASE",
            },
            type: "button"
        }
    },
    delay: {
        type: Number,
        default: 0
    }
});

const TYPES = {
    PRIMARY  : "PRIMARY",
    SECONDARY: "SECONDARY",
};

const COLORS = {
    BLUE       : "#166CF7",
    GREEN      : "#69AF31",
    RED        : "#D0454A",
    GRAY       : "#A2A2A2",
    WHITE      : "#FFF",
    TRANSPARENT: "transparent",
};

const OPACITY = {
    LIGHT: "99"
};

const style = computed<StyleValue>(() => {
    const size = props.data.apparence.size;
    const type = props.data.apparence.type;
    const color = props.data.apparence.color;
    const rounded = props.data.apparence.rounded;

    return Object.assign({}, getSize(size), getBorderRadius(size, rounded), getColors(type, color));
});

const locked = ref(false);

// ############################################## FUNCTIONS ##############################################

const getSize = (size: "BASE" | "XS"): StyleValue => {
    return size == "XS" ? { "height": "33px", "padding": "0px 15px" } : { "height": "50px", "padding": "0px 25px" };
};

const getBorderRadius = (size: "BASE" | "XS", borderRadius?: "BASE" | "FULL"): StyleValue => {
    switch (size) {
        case "XS":
            return { "border-radius": "9999px" };
        case "BASE":
        default:
            return borderRadius == "FULL" ? { "border-radius": "9999px" } : { "border-radius": "14px" };
    }
};

const getColors = (type: keyof typeof TYPES, color: keyof typeof COLORS): StyleValue => {
  if (props.data.disabled) {
    return { "background-color": COLORS.GRAY, color: COLORS.WHITE };
  }

  const buttonStyles: { [key: string]: StyleValue } = {
    PRIMARY: { "background-color": COLORS[color] },
    SECONDARY: {
      "background-color": COLORS.TRANSPARENT,
      "border-color"    : COLORS[color] + OPACITY.LIGHT,
      "color"           : COLORS[color],
      "border-width"    : "2px",
    },
  };

  return buttonStyles[type as keyof typeof buttonStyles] || buttonStyles.PRIMARY;
};

// ############################################## EVENTS ##############################################

const emits = defineEmits(["@click"]);

const handleClick = (event: Event) => {
    if (props.data.disabled || locked.value) {
        return;
    }

    if (props.delay > 0) {
        locked.value = true;
        emits("@click", event);

        setTimeout(() => {
            locked.value = false;
        }, props.delay);
    } else {
        emits("@click", event);
    }
};
</script>
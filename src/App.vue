<template>
  <!-- Desktop -->
  <div class="items-center justify-center hidden w-screen h-screen md:flex">
    <div>Revenez nous voir sur mobile !</div>
  </div>

  <!-- Mobile -->
  <div class="w-screen h-full select-none md:hidden">
    <Search ref="search" :app="{ setFixed, removeFixed }" />

    <div ref="content">
      <router-view></router-view>
    </div>

    <Navbar ref="navbar" @@open-search="handleSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import Navbar from "./layouts/Navbar.vue";
import Search from "./layouts/Search.vue";

// ########################################### VARIABLES ###########################################

const search = ref<InstanceType<typeof Search> | null>(null);

const navbar = ref<InstanceType<typeof Navbar> | null>(null);

const content = ref<HTMLElement | null>(null);

let prevScrollY = 0;

// ########################################### FUNCTIONS ###########################################

const setFixed = () => {
  prevScrollY = window.scrollY;

  if (content.value) {
    content.value.style.position = "fixed";
    content.value.style.width = "100%";
    content.value.style.top = `-${prevScrollY}px`;
    window.scrollTo(0, prevScrollY);
  }
}

const removeFixed = () => {
  if (content.value) {
    content.value.style.position = "relative";
    content.value.style.width = "auto";
    content.value.style.top = "auto";
    window.scrollTo(0, prevScrollY);
  }
}

const handleSearch = () => {
  search.value?.open();
}

// ########################################### HOOKS ###########################################

onMounted(() => {
  // Disable pinch zoom on mobile
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });
});

// ########################################### EXPORTS ###########################################

provide("props", search);
</script>
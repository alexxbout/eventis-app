<template>
  <!-- Desktop -->
  <div class="hidden w-screen h-screen md:flex items-center justify-center">
    <div>Revenez nous voir sur mobile !</div>
  </div>

  <!-- Mobile -->
  <div class="md:hidden w-screen h-full select-none">
    <Search ref="searchComponent" :app="{ setFixed, removeFixed }" />

    <div ref="content">
      <router-view class="px-5 py-10 bg-white"></router-view>
    </div>

    <Navbar ref="navbar" @@open-search="handleSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType } from "vue";
import Navbar from "./layouts/Navbar.vue";
import Search from "./layouts/Search.vue";
import { IApp } from "./types/interfaces";

// ########################################### Variables ###########################################  
const searchComponent = ref<InstanceType<typeof Search> | null>(null);

const navbar = ref<InstanceType<typeof Navbar> | null>(null);

const content = ref<HTMLElement | null>(null);

let prevScrollY = 0;

// ########################################### Fonctions ###########################################
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
  searchComponent.value?.open();
}

// ########################################### Hooks ###########################################
onMounted(() => {
  // Disable pinch zoom on mobile
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });
});

</script>
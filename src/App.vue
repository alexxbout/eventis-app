<template>
  <div class="hidden w-screen h-screen md:flex items-center justify-center">
    <div>Revenez nous voir sur mobile !</div>
  </div>

  <router-view class="md:hidden w-screen h-full px-5 py-10"></router-view>

  <div class="md:hidden">
      <Navbar/>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>
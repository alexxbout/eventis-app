<template>
  <div class="hidden w-screen h-screen md:flex items-center justify-center">
    <div>Revenez nous voir sur mobile !</div>
  </div>

  <div class="md:hidden w-screen h-full">

    <div>
      <Search ref="searchComponent" class="hidden" :searchCallBack="toggleSearch" />
    </div>

    <div ref="content">
      <router-view class="px-5 py-10 bg-white"></router-view>
    </div>
  </div>

  <div class="md:hidden">
    <Navbar ref="nav" :searchCallBack="toggleSearch" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, ComponentPublicInstance } from "vue";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Navbar from "./components/Navbar.vue";
import Search from "./components/Search.vue";

let searchComponentAnimation: GSAPAnimation | null = null;
let contentAnimation: GSAPAnimation | null = null;

const searchComponent = ref<InstanceType<typeof Search> | null>(null);

const showSearch = ref(false);

const content = ref<HTMLElement | null>(null);

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  animeSearch();
}

let prevScrollY = 0;

function animeSearch() {
  const currentScrollY = window.scrollY;

  if (showSearch.value) {

    prevScrollY = currentScrollY;

    if (content.value) {
      content.value.style.position = "fixed";
      content.value.style.width = "100%";
      content.value.style.top = `-${currentScrollY}px`;
      window.scrollTo(0, currentScrollY);
    }

    searchComponentAnimation?.play();
    contentAnimation?.play();
  } else {
    searchComponentAnimation?.reverse();
    contentAnimation?.reverse();

    if (content.value) {
      content.value.style.position = "relative";
      content.value.style.width = "auto";
      content.value.style.top = "auto";
      window.scrollTo(0, prevScrollY);
    }
  }
}

onMounted(() => {
  // Disable pinch zoom on mobile
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });


  if (searchComponent.value?.card) {

    contentAnimation = gsap.fromTo(content.value,
      {
        opacity: 1,
      },
      {
        opacity: 0.2,
        duration: 0.3,
        ease: "power2.out",
        paused: true
      }
    );

    searchComponentAnimation = gsap.fromTo(searchComponent.value.card,
      {
        translateY: "100%",
      },
      {
        translateY: "0%",
        duration: 0.3,
        ease: "power2.out",
        paused: true,
        onReverseComplete: () => {
          searchComponent.value?.card?.classList.add("hidden");
        },
        onStart: () => {
          searchComponent.value?.card?.classList.remove("hidden");
        }
      }
    );
  }
});

</script>
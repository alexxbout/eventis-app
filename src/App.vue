<template>
  <div class="hidden w-screen h-screen md:flex items-center justify-center">
    <div>Revenez nous voir sur mobile !</div>
  </div>

  <div class="md:hidden w-screen h-full select-none">

    <div>
      <Search ref="searchComponent" class="hidden" :searchCallBack="toggleSearch" />
    </div>

    <div ref="content">
      <router-view class="px-5 py-10 bg-white" :funcs="funcs"></router-view>
    </div>
  </div>

  <div class="md:hidden">
    <Navbar ref="navbar" :searchCallBack="toggleSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import Navbar from "./components/Navbar.vue";
import Search from "./components/Search.vue";

export interface IApp {
  setFixed: () => void;
  removeFixed: () => void;
  isFixed: () => boolean;
  showNavbar: () => void;
  hideNavbar: () => void;
}

// ########################################### Variables ###########################################  

// Bug quand on utilise une ref ici
let searchComponentAnimation: GSAPAnimation | null = null;

// let navbarAnimation: GSAPAnimation | null = null;

const searchComponent = ref<InstanceType<typeof Search> | null>(null);

const navbar = ref<InstanceType<typeof Navbar> | null>(null);

const showSearch = ref(false);

const content = ref<HTMLElement | null>(null);

let prevScrollY = 0;

// ########################################### Fonctions ###########################################

const hideNavbar = () => {
  if (!navbar.value || !navbar.value.el) return

  navbar.value.el.classList.add("hidden");
}

const showNavbar = () => {
  if (!navbar.value || !navbar.value.el) return

  navbar.value.el.classList.remove("hidden");
}

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

const isFixed = () => {
  return content.value?.style.position === "fixed";
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  animeSearch();
}

function animeSearch() {
  const currentScrollY = window.scrollY;

  if (showSearch.value) {
    prevScrollY = currentScrollY;

    setFixed();

    searchComponentAnimation?.timeScale(1);
    searchComponentAnimation?.play();
  } else {
    searchComponentAnimation?.timeScale(2);
    searchComponentAnimation?.reverse();

    removeFixed();
  }
}

const funcs: IApp = {
  setFixed,
  removeFixed,
  isFixed,
  showNavbar,
  hideNavbar
}

onMounted(() => {
  // Handle ref errors
  if (!searchComponent.value || !content.value || !navbar.value) {
    console.error("some refs are undefined");
    return;
  }

  // Disable pinch zoom on mobile
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });

  // Init search animation
  searchComponentAnimation = gsap.fromTo(searchComponent.value.el,
    {
      translateY: "100%"
    },
    {
      translateY: "0%",
      duration: 0.75,
      ease: "expo.out",
      paused: true,
      onReverseComplete: () => {
        searchComponent.value?.el?.classList.add("hidden");
      },
      onStart: () => {
        searchComponent.value?.el?.classList.remove("hidden");
      }
    }
  );
});

</script>
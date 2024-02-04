<script setup lang="ts">
import { view } from "./store";
import Commands from "./components/Commands.vue";
import Directory from "./components/Directory.vue";
import File from "./components/File.vue";
import { computed } from "vue";
import { viewConfig } from "./utils";

const config = computed(() => viewConfig(view.value.currentView));

function updateVies() {
  view.value.currentView === "DIRECTORY"
    ? view.value.setCurrentView("FILE")
    : view.value.setCurrentView("DIRECTORY");
}
</script>

<template>
  <div
    class="w-screen h-screen grid grid-cols-12 grid-rows-12 relative text-white"
  >
    <div :style="config" class="row-start-1 row-end-12 col-span-12">
      <template v-if="view.currentView === 'DIRECTORY'">
        <Directory />
      </template>
      <template v-else-if="view.currentView === 'FILE'">
        <File />
      </template>
    </div>
    <Commands />
    <button @click="updateVies" class="absolute top-0 right-0">Click</button>
  </div>
</template>

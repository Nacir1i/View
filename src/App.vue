<script setup lang="ts">
import { directory, view } from "./store";
import Commands from "./components/Commands.vue";
import Directory from "./components/Directory.vue";
import File from "./components/File.vue";
import { computed, ref, onMounted } from "vue";
import { viewConfig } from "./utils";
import { desktopDir } from "@tauri-apps/api/path";

const config = computed(() => viewConfig(view.value.currentView));
const inputRef = ref<InstanceType<typeof Commands> | null>(null);

async function setup() {
  const initPath = await desktopDir();

  console.log(initPath);

  directory.value.setPath(initPath);
}

function focusInput() {
  inputRef.value?.inputRef?.focus();
  inputRef.value?.inputRef?.scrollIntoView();
}

function shortcutListener(event: KeyboardEvent) {
  if (event.ctrlKey && event.shiftKey && event.key === "C") {
    focusInput();
  }
}

onMounted(() => {
  document.addEventListener("keydown", shortcutListener);

  setup();
  focusInput();
});
</script>

<template>
  <div
    class="w-screen h-screen grid grid-cols-12 grid-rows-12 relative text-white text-sm font-mono"
  >
    <div
      :style="config"
      class="row-start-1 row-end-10 col-span-12 p-2 overflow-auto"
    >
      <template v-if="view.currentView === 'DIRECTORY'">
        <Directory />
      </template>
      <template v-else-if="view.currentView === 'FILE'">
        <File />
      </template>
    </div>
    <Commands ref="inputRef" />
  </div>
</template>

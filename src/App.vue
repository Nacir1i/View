<script setup lang="ts">
import { view } from "./store";
import Commands from "./components/Commands.vue";
import Directory from "./components/Directory.vue";
import File from "./components/File.vue";
import { directoryStore } from "./store";
import { computed, ref, onMounted } from "vue";
import { viewConfig } from "./utils";
import { desktopDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { DirectoryEntity } from "./utils/interface";
import Help from "./components/Help.vue";
import { useEventListener } from "@vueuse/core";

const config = computed(() => viewConfig(view.value.currentView));
const inputRef = ref<InstanceType<typeof Commands> | null>(null);

function focusInput() {
  inputRef.value?.inputRef?.focus();
  inputRef.value?.inputRef?.scrollIntoView();
}

function shortcutListener(event: KeyboardEvent) {
  if (event.ctrlKey && event.shiftKey && event.key === "C") {
    focusInput();
  }
}

async function setup() {
  const desktopPath = await desktopDir();

  const data = await invoke<{
    data: DirectoryEntity[];
    absolute_path: string;
  }>("open_dir", {
    pathString: desktopPath,
  });

  directoryStore.value.set(desktopPath, data.data);
}

onMounted(() => {
  setup();
  focusInput();
});

useEventListener("keydown", shortcutListener);
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
      <template v-else-if="view.currentView === 'HELP'">
        <Help />
      </template>
    </div>
    <Commands ref="inputRef" />
  </div>
</template>

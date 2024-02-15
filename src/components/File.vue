<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { computed, onMounted, ref, watch } from "vue";
import { FileEntity } from "../utils/interface";
import { commandHistory, file } from "../store";

const content = ref<string>("");
const linesCount = computed<number>(() => {
  return content.value.split("\n").length;
});

async function initContent() {
  try {
    const data = await invoke<FileEntity>("open_file", {
      pathString: file.value.path,
    });

    if (data) {
      content.value = data.content;
    }
  } catch (error: unknown) {
    commandHistory.value.addHistory(error as string);
  }
}

watch(file.value, async (_newContent, _oldContent) => {
  initContent();
});

onMounted(() => {
  initContent();
});
</script>
<template>
  <div class="flex justify-start items-start gap-2 w-full h-full">
    <ul class="text-gray-500 text-right">
      <li v-for="i in linesCount">{{ i }}</li>
    </ul>
    <textarea
      data-role="none"
      v-model="content"
      name="textarea"
      id="textarea"
      :rows="linesCount"
      class="bg-inherit w-full resize-none focus:outline-none whitespace-pre"
    ></textarea>
  </div>
</template>

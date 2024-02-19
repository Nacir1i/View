<script setup lang="ts">
import { computed } from "vue";
import { fileStore } from "../store";

const linesCount = computed<number>(() => {
  return fileStore.value.content.split("\n").length;
});
</script>
<template>
  <div class="flex justify-start items-start gap-2 w-full h-full">
    <ul class="text-gray-500 text-right">
      <li v-for="i in linesCount">{{ i }}</li>
    </ul>
    <textarea
      data-role="none"
      v-model="fileStore.content"
      name="textarea"
      id="textarea"
      :rows="linesCount"
      class="bg-inherit w-full resize-none focus:outline-none whitespace-pre"
    ></textarea>
  </div>
</template>

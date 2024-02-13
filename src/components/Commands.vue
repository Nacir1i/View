<script setup lang="ts">
import { ref } from "vue";
import { directoryAbsolutePath } from "../store";
import { Interpreter } from "../utils/interpreter";

let input = "";
let inputRef = ref<HTMLInputElement | null>(null);
let container = ref<HTMLDivElement | null>(null);
let commandHistory = ref<string[]>([]);

function interpretCommand() {
  const interpreter = new Interpreter(input);

  commandHistory.value = [...commandHistory.value, input];

  interpreter.execute();

  input = "";
  focusInput();
}

function focusInput() {
  inputRef.value?.focus();
  container.value?.lastElementChild?.scrollIntoView();
}

defineExpose({ inputRef });
</script>

<template>
  <div
    class="row-start-10 row-end-13 bg-[#222831] col-span-12 grid grid-rows-6"
  >
    <div
      class="w-full h-10 bg-[#606470] flex justify-start items-center row-start-1 row-end-2"
    >
      <h1>{{ directoryAbsolutePath.path }}</h1>
    </div>
    <div
      ref="container"
      class="w-full py-2 row-start-2 row-end-7 overflow-auto"
    >
      <p v-for="command in commandHistory">{{ command }}</p>
      <div class="w-full flex items-center justify-start pl-2 gap-2 sticky">
        <p>~</p>
        <input
          ref="inputRef"
          @keyup.enter="interpretCommand"
          v-model="input"
          type="text"
          class="bg-inherit w-full h-full focus:outline-none"
        />
      </div>
      <span>&zwnj;</span>
    </div>
  </div>
</template>

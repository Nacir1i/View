<script setup lang="ts">
import { directoryAbsolutePath } from "../store";
import { Interpreter } from "../utils/interpreter";

let input = "";

function interpretCommand() {
  const interpreter = new Interpreter(input);

  interpreter.execute();
}
</script>

<template>
  <div
    class="row-start-12 row-end-13 bg-[#222831] col-span-12 grid grid-rows-3"
  >
    <div class="w-full bg-[#606470] row-span-1 flex justify-start items-center">
      <h1>{{ directoryAbsolutePath.path }}</h1>
    </div>
    <div class="row-span-2 flex items-center justify-start pl-2 gap-2">
      <p>~</p>
      <input
        @keyup.enter="interpretCommand"
        v-model="input"
        type="text"
        class="bg-inherit w-full h-full focus:outline-none"
      />
    </div>
  </div>
</template>

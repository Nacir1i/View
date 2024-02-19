<script setup lang="ts">
import Kbd from "./Kbd.vue";
</script>

<template>
  <div
    class="w-full h-full bg-inherit flex flex-col justify-end items-center gap-3 pb-14"
  >
    <div class="flex items-center gap-1">
      Focus command input:
      <Kbd>Ctrl</Kbd>
      <p>+</p>
      <Kbd>Shift</Kbd>
      <p>+</p>
      <Kbd>C</Kbd>
    </div>
    <div>
      command is composed of 3 arguments:
      <span class="bg-green-400 text-black py-1 px-2 rounded-lg">ACTION</span>,
      <span class="bg-blue-400 text-black py-1 px-2 rounded-lg">TARGET</span>
      and Args
    </div>
    <dir
      class="w-[30rem] h-48 bg-slate-600 grid grid-cols-4 grid-rows-5 m-0 p-0"
    >
      <div
        class="row-start-1 row-end-2 col-start-1 col-end-3 flex justify-center items-center border border-white"
      >
        <p>Actions</p>
      </div>
      <div
        class="row-start-1 row-end-2 col-start-3 col-end-4 flex justify-center items-center border border-white"
      >
        <p>Targets</p>
      </div>
      <div
        class="row-start-1 row-end-2 col-start-4 col-end-5 flex justify-center items-center border border-white"
      >
        <p>Args</p>
      </div>
      <div
        class="row-start-2 row-end-6 col-start-1 col-end-3 flex gap-2 flex-wrap border border-white p-2"
      >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >change</span
        >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >open</span
        >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >quit</span
        >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >switch</span
        >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >clear</span
        >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >create</span
        >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >save</span
        >
        <span class="bg-green-400 text-black py-1 px-2 rounded-lg h-8"
          >help</span
        >
      </div>
      <div
        class="row-start-2 row-end-6 col-start-3 col-end-4 border border-white p-2 space-x-2"
      >
        <span class="bg-blue-400 text-black py-1 px-2 rounded-lg h-8">dir</span>
        <span class="bg-blue-400 text-black py-1 px-2 rounded-lg h-8">fil</span>
      </div>
      <div
        class="row-start-2 row-end-6 col-start-4 col-end-5 border border-white p-2"
      ></div>
    </dir>
    <div>
      <h1>
        Examples: Change dir ../Desktop/dev || open file
        Desktop/project/src/index.#
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const title = ref("Commands");
</script>

<template>
  <div class="row-start-12 row-end-13 bg-[#222831] col-span-12">
    <div class="w-full bg-[#606470]">
      <h1>/current/directory/file.c - 0 lines (modified)</h1>
    </div>
    <h1>{{ title }}</h1>
  </div>
</template>

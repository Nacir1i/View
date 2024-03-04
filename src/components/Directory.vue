<script setup lang="ts">
import { directoryStore } from "../store";
// import { convertDirSize } from "../utils/index";
</script>

<template>
  <table class="text-lg text-left divide-y divide-yellow-100">
    <thead>
      <tr>
        <!-- <th class="px-4">size</th> -->
        <th class="px-4">name</th>
        <th class="px-4">path</th>
        <th class="px-4">created</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entity in directoryStore.content">
        <!-- <td class="px-4">
          {{ convertDirSize(entity.size) }}
        </td> -->
        <td class="px-4">{{ entity.name }}</td>
        <td class="px-4">{{ entity.path }}</td>
        <td class="px-4">{{ entity.created_at }}</td>
      </tr>
    </tbody>
  </table>
</template>

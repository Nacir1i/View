<script setup lang="ts">
import { directory, directoryAbsolutePath } from "../store";
import { invoke } from "@tauri-apps/api/tauri";
import { onMounted, ref, watch } from "vue";
import { DirectoryEntity } from "../utils/interface";
// import { convertDirSize } from "../utils/index";

const content = ref<DirectoryEntity[]>([]);

async function initContent() {
  const data = await invoke<{ data: DirectoryEntity[]; absolute_path: string }>(
    "open_dir",
    {
      pathString: directory.value.path,
    }
  );

  if (data) {
    content.value = data.data;
    directoryAbsolutePath.value.setPath(data.absolute_path);
  }
}

watch(directory.value, async (_newDir, _oldDir) => {
  initContent();
});

onMounted(() => {
  initContent();
});
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
      <tr v-for="entity in content">
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

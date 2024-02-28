<script setup lang="ts">
import { computed, ref } from "vue";
import { useFocus } from "@vueuse/core";
import { fileStore } from "../store";
import CursorVue from "./Cursor.vue";
import { langConfig } from "../utils";

const cursorRef = ref<InstanceType<typeof CursorVue> | null>(null);
const divRef = ref<HTMLDivElement | null>(null);

const { focused } = useFocus(divRef, { initialValue: false });

function type(key: string) {
  if (!cursorRef.value?.cursor.index) return;

  if (key === "\n") {
    let targetLine = fileStore.value.content[cursorRef.value?.cursor.index.row];

    const newLine = targetLine.splice(0, cursorRef.value?.cursor.index.col);

    fileStore.value.content.splice(
      cursorRef.value?.cursor.index.row,
      0,
      newLine
    );

    cursorRef.value?.cursor.set({
      row: cursorRef.value?.cursor.index.row + 1,
      col: 0,
    });
  } else {
    fileStore.value.content[cursorRef.value?.cursor.index.row].splice(
      cursorRef.value?.cursor.index.col,
      0,
      key
    );
    cursorRef.value?.cursor.moveRight();
  }
}
function _delete() {
  if (!cursorRef.value?.cursor.index) return;

  if (cursorRef.value?.cursor.index.col > 0) {
    fileStore.value.content[cursorRef.value?.cursor.index.row].splice(
      cursorRef.value?.cursor.index.col - 1,
      1
    );
    cursorRef.value?.cursor.moveLeft();
  } else if (cursorRef.value?.cursor.index.row > 0) {
    const currentRow =
      fileStore.value.content[cursorRef.value?.cursor.index.row];
    const previousRow =
      fileStore.value.content[cursorRef.value?.cursor.index.row - 1];
    const lastCharOfPreviousRow = previousRow[previousRow.length - 1];

    fileStore.value.content[cursorRef.value?.cursor.index.row - 1] =
      previousRow.concat(currentRow);
    fileStore.value.content.splice(cursorRef.value?.cursor.index.row, 1);

    cursorRef.value?.cursor.set({
      row: cursorRef.value?.cursor.index.row - 1,
      col: lastCharOfPreviousRow ? previousRow.length : 0,
    });
  }
}

let formattedWords = computed(() => {
  let computed: string[][] = [];

  for (let i = 0; i < fileStore.value.content.length; i++) {
    let line: string[] = [];

    const isLineEmpty = fileStore.value.content[i].length === 0;
    if (isLineEmpty) {
      computed.push(line);

      continue;
    }

    let newWord = "";

    for (let j = 0; j < fileStore.value.content[i].length; j++) {
      const isEndOfWord = fileStore.value.content[i][j] === " ";

      if (lang.value.symbols.includes(fileStore.value.content[i][j])) {
        line.push(newWord);
        line.push(fileStore.value.content[i][j]);

        newWord = "";
      } else if (isEndOfWord) {
        line.push(newWord);
        line.push(" ");
        newWord = "";
      } else {
        newWord += `${fileStore.value.content[i][j]}`;
      }
    }

    line.push(newWord);
    computed.push(line);
  }

  return computed;
});

const lang = computed(() => {
  return langConfig(fileStore.value.extension);
});

function keyEvent(event: KeyboardEvent) {
  if (!event.isTrusted) return;

  if (event.key.length === 1) {
    type(event.key);
  } else if (event.key === "Backspace") {
    _delete();
  } else if (event.key === "Enter") {
    type("\n");
  }
}

function syntax(word: string): { color: string } {
  let langStyle = { color: "" };

  if (lang.value.symbols.includes(word)) {
    langStyle = {
      color: "#7dd87d",
    };
  }

  if (lang.value.keyWords.includes(word)) {
    langStyle = {
      color: "#d59bf6",
    };
  }

  return langStyle;
}
</script>

<template>
  <div
    ref="divRef"
    @keydown="keyEvent"
    class="w-full h-full relative"
    tabindex="0"
  >
    <CursorVue v-if="focused" ref="cursorRef" />
    <div
      v-for="(line, index) in formattedWords"
      class="relative z-50 flex focus:outline-none"
    >
      <span class="w-7 text-slate-500">{{ index + 1 }}</span>
      <template v-if="line.length === 0">
        <br />
      </template>
      <template v-else>
        <span v-for="word in line" class="word" :style="syntax(word)">
          <template v-if="word === ' '">&#8199;</template>
          <template v-else>{{ word }}</template>
        </span>
      </template>
    </div>
  </div>
</template>

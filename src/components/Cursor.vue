<script setup lang="ts">
import { computed, ref } from "vue";
import { useEventListener } from "@vueuse/core";
import { Cursor } from "../utils/interface";
import { fileStore } from "../store";

const elementRef = ref<HTMLSpanElement>();

let cursor = ref<Cursor>({
  index: { row: 0, col: 0 },
  set(index: { col: number; row: number }) {
    this.index = index;
  },
  moveRight() {
    let newIndex = { row: 0, col: 0 };

    const endOfRows = this.index.row === fileStore.value.content.length - 1;
    const endOfLine =
      this.index.col === fileStore.value.content[this.index.row].length;

    if (endOfLine && endOfRows) {
      return;
    }
    if (endOfLine) {
      newIndex = { row: this.index.row + 1, col: 0 };
    } else {
      newIndex = { row: this.index.row, col: this.index.col + 1 };
    }

    this.set(newIndex);
  },
  moveLeft() {
    let newIndex = { row: 1, col: 0 };

    const endOfRows = this.index.row === 0;
    const endOfLine = this.index.col === 0;

    if (endOfRows && endOfLine) {
      return;
    }
    if (endOfLine) {
      newIndex = {
        row: this.index.row - 1,
        col: fileStore.value.content[this.index.row - 1].length,
      };
    } else {
      newIndex = { row: this.index.row, col: this.index.col - 1 };
    }

    this.set(newIndex);
  },
  moveUp() {
    this.scrollIntoView();
    let newIndex = { row: 0, col: 0 };

    const endOfRows = this.index.row === 0;
    const colTooBig =
      this.index.col > fileStore.value.content[this.index.row - 1].length - 1;

    if (endOfRows) {
      return;
    }
    if (colTooBig) {
      newIndex = {
        row: this.index.row - 1,
        col: fileStore.value.content[this.index.row - 1].length,
      };
    } else {
      newIndex = { row: this.index.row - 1, col: this.index.col };
    }

    this.set(newIndex);
  },
  moveDown() {
    this.scrollIntoView();
    let newIndex = { row: 0, col: 0 };

    const endOfRows = this.index.row === fileStore.value.content.length - 1;
    const colTooBig =
      this.index.col > fileStore.value.content[this.index.row + 1].length - 1;

    if (endOfRows) {
      return;
    }
    if (colTooBig) {
      newIndex = {
        row: this.index.row + 1,
        col: fileStore.value.content[this.index.row + 1].length,
      };
    } else {
      newIndex = { row: this.index.row + 1, col: this.index.col };
    }

    this.set(newIndex);
  },
  scrollIntoView() {
    elementRef.value?.scrollIntoView({ block: "center" });
  },
});

const cursorAbsolutePosition = computed(() => ({
  top: cursor.value.index.row * 20 + "px",
  left: cursor.value.index.col * 8 + 28 + "px",
}));

function keyEvent(event: KeyboardEvent) {
  if (!event.isTrusted) return;

  if (event.key === "ArrowRight") {
    cursor.value.moveRight();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    cursor.value.moveLeft();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    cursor.value.moveDown();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    cursor.value.moveUp();
  }
}

defineExpose({
  cursor,
});

useEventListener(document, "keydown", keyEvent);
</script>

<template>
  <span
    ref="elementRef"
    :style="cursorAbsolutePosition"
    class="animate-blink absolute bg-red-700 w-[8px] h-[18px] z-40"
  ></span>
</template>

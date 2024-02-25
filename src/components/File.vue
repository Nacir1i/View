<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Content, Cursor } from "../utils/interface";
import { fileStore } from "../store";

const HELLO = [
  ["h", "o", "l", "l", "o", "!"],
  [],
  ["z", "e", "l", "l", "o", "!", " ", "g", "e", "l", "l", "o", "!"],
  [],
  ["b", "e", "v", "l", "o", "!"],
];

let content = ref<Content>({
  content: HELLO,
  type(key: string) {
    if (key === "\n") {
      let targetLine = content.value.content[cursor.value.index.row];

      const newLine = targetLine.splice(0, cursor.value.index.col);

      this.content.splice(cursor.value.index.row, 0, newLine);

      cursor.value.set({ row: cursor.value.index.row + 1, col: 0 });
    } else {
      this.content[cursor.value.index.row].splice(
        cursor.value.index.col,
        0,
        key
      );
      cursor.value.moveRight();
    }
  },
  delete() {
    if (cursor.value.index.col > 0) {
      content.value.content[cursor.value.index.row].splice(
        cursor.value.index.col - 1,
        1
      );
      cursor.value.moveLeft();
    } else if (cursor.value.index.row > 0) {
      const currentRow = content.value.content[cursor.value.index.row];
      const previousRow = content.value.content[cursor.value.index.row - 1];
      const lastCharOfPreviousRow = previousRow[previousRow.length - 1];

      content.value.content[cursor.value.index.row - 1] =
        previousRow.concat(currentRow);
      content.value.content.splice(cursor.value.index.row, 1);
      cursor.value.index.row--;
      cursor.value.index.col = lastCharOfPreviousRow ? previousRow.length : 0;
    }
  },
});

let cursor = ref<Cursor>({
  index: { row: 0, col: 0 },
  set(index: { col: number; row: number }) {
    this.index = index;
  },
  moveRight() {
    let newIndex = { row: 0, col: 0 };

    const endOfRows = this.index.row === content.value.content.length - 1;
    const endOfLine =
      this.index.col === content.value.content[this.index.row].length;

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
        col: content.value.content[this.index.row - 1].length,
      };
    } else {
      newIndex = { row: this.index.row, col: this.index.col - 1 };
    }

    this.set(newIndex);
  },
  moveUp() {
    let newIndex = { row: 0, col: 0 };

    const endOfRows = this.index.row === 0;
    const colTooBig =
      this.index.col > content.value.content[this.index.row - 1].length - 1;

    if (endOfRows) {
      return;
    }
    if (colTooBig) {
      newIndex = {
        row: this.index.row - 1,
        col: content.value.content[this.index.row - 1].length,
      };
    } else {
      newIndex = { row: this.index.row - 1, col: this.index.col };
    }

    this.set(newIndex);
  },
  moveDown() {
    let newIndex = { row: 0, col: 0 };

    const endOfRows = this.index.row === content.value.content.length - 1;
    const colTooBig =
      this.index.col > content.value.content[this.index.row + 1].length - 1;

    if (endOfRows) {
      return;
    }
    if (colTooBig) {
      newIndex = {
        row: this.index.row + 1,
        col: content.value.content[this.index.row + 1].length,
      };
    } else {
      newIndex = { row: this.index.row + 1, col: this.index.col };
    }

    this.set(newIndex);
  },
});

let computedValue = computed(() => {
  let computed = "";

  for (let i = 0; i < content.value.content.length; i++) {
    computed += "<div class='line'>";

    const isLineIndexed = cursor.value.index.row === i;
    const isLineEmpty = content.value.content[i].length === 0;
    const isEndOfLineIndexed =
      isLineIndexed &&
      cursor.value.index.col == content.value.content[i].length;

    if (isLineEmpty) {
      if (isLineIndexed) {
        computed +=
          "<span class='word'><span class='blink absolute'></span>&#160;</span></div>";
      } else {
        computed += "<span class='word'>&#160;</span></div>";
      }

      continue;
    }

    let newWord = "";

    for (let j = 0; j < content.value.content[i].length; j++) {
      const isCharIndexed = isLineIndexed && cursor.value.index.col === j;
      const isEndOfWord = content.value.content[i][j] === " ";

      if (isCharIndexed) {
        newWord += "<span class='blink absolute'></span>";
      }

      if (isEndOfWord) {
        computed += `<span class='word'>${newWord}&#8197;</span>`;

        newWord = "";
      } else {
        newWord += `${content.value.content[i][j]}`;
      }
    }

    if (isEndOfLineIndexed) {
      newWord += "<span class='blink absolute'></span>";
    }

    computed += `<span class='word'>${newWord}</span></div>`;
  }

  return computed;
});

function keyEvent(event: KeyboardEvent) {
  if (!event.isTrusted) return;

  if (event.key.length === 1) {
    content.value.type(event.key);
  } else if (event.key === "Backspace") {
    content.value.delete();
  } else if (event.key === "Enter") {
    content.value.type("\n");
  } else if (event.key === "ArrowRight") {
    cursor.value.moveRight();
  } else if (event.key === "ArrowLeft") {
    cursor.value.moveLeft();
  } else if (event.key === "ArrowDown") {
    cursor.value.moveDown();
  } else if (event.key === "ArrowUp") {
    cursor.value.moveUp();
  }
}

function setup() {
  content.value.content = fileStore.value.content;
}

onMounted(() => {
  document.addEventListener("keydown", keyEvent);

  setup();
});
</script>

<template>
  <div class="flex flex-col justify-start items-start gap-2 w-full h-full">
    <div v-html="computedValue" class="font-mono"></div>
  </div>
</template>

<style>
.blink {
  width: 2px;
  height: 20px;
  background-color: rgb(0, 255, 200);
  animation: blink-animation 2s steps(2, start) infinite;
  -webkit-animation: blink-animation 2s steps(2, start) infinite;
}
.absolute {
  position: absolute;
  top: 1px;
  height: 15px;
}
.word {
  position: relative;
  text-decoration: none;
}
.line {
  display: flex;
  justify-content: flex-start;
  align-self: center;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>

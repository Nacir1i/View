export const LANG: Record<string, { symbols: string[]; keyWords: string[] }> = {
  js: {
    symbols: [
      "{",
      "}",
      "(",
      ")",
      "]",
      "[",
      ";",
      ":",
      ",",
      "=",
      "-",
      "+",
      '"',
      "'",
      "`",
      "<",
      ">",
    ],
    keyWords: [
      "import",
      "from",
      "export",
      "const",
      "let",
      "for",
      "in",
      "function",
      "async",
      "return",
      "continue",
      "break",
    ],
  },
  ts: {
    symbols: [
      "{",
      "}",
      "(",
      ")",
      "]",
      "[",
      ";",
      ":",
      ",",
      "=",
      "-",
      "+",
      '"',
      "'",
      "`",
      "<",
      ">",
    ],
    keyWords: [
      "import",
      "from",
      "export",
      "const",
      "let",
      "for",
      "in",
      "function",
      "async",
      "return",
      "continue",
      "break",
    ],
  },
} as const;

export type Lang = keyof typeof LANG;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blinkAnimation: {
          to: {
            visibility: "hidden",
          },
        },
      },
      animation: {
        blink: "blink-animation 1500ms steps(2, start) infinite;",
      },
    },
    fontFamily: {
      oxanium: ["Oxanium"],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
  },
  plugins: [],
};

import { ref } from "vue";
import { View } from "./utils/interface";

interface ViewStore {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export const view = ref<ViewStore>({
  currentView: "DIRECTORY",
  setCurrentView(view) {
    this.currentView = view;
  },
});

import React from "react";
import ReactDOM from "react-dom/client";

import { MantineProvider } from "@mantine/core";
import { create } from "zustand";
import { createClient } from "@liveblocks/client";
import { WithLiveblocks, liveblocks } from "@liveblocks/zustand";
import { App } from ".";
import { Notifications } from "@mantine/notifications";

const client = createClient({
  publicApiKey:
    "pk_dev_KjIW3Oo2aAy0odoPC-Oov1lPAy5cvegbU5nTHKJcksE9r0PNimj0T4Jn5WlYgu0R",
});

export interface Box {
  id: string;
  contents: string[];
}

export interface BoxesStore {
  boxes: Array<Box>;
  setBoxes: (boxes: Array<Box>) => void;
  addBox: (box: Box) => void;
  updateBox: (box: Box) => void;
  removeBox: (box: Box) => void;
}

export const useBoxesStore = create<WithLiveblocks<BoxesStore>>(
  liveblocks(
    (set) => ({
      boxes: [],
      setBoxes: (boxes) => set({ boxes }),
      addBox: (box) => set((state) => ({ boxes: [...state.boxes, box] })),
      updateBox: (box) =>
        set((state) => ({
          boxes: state.boxes.map((b) => (b.id === box.id ? box : b)),
        })),
      removeBox: (box) =>
        set((state) => ({
          boxes: state.boxes.filter((b) => b.id !== box.id),
        })),
    }),
    {
      client,
      storageMapping: {
        boxes: true,
      },
    }
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>
);

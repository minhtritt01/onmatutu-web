"use client";

import { createContext, useContext } from "react";

export const FullscreenContext = createContext(false);

export function useIsFullscreen() {
  return useContext(FullscreenContext);
}

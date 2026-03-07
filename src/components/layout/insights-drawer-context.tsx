"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface InsightsDrawerState {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const InsightsDrawerContext = createContext<InsightsDrawerState>({
  open: false,
  toggle: () => {},
  close: () => {},
});

export const useInsightsDrawer = () => useContext(InsightsDrawerContext);

export function InsightsDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <InsightsDrawerContext.Provider value={{ open, toggle, close }}>
      {children}
    </InsightsDrawerContext.Provider>
  );
}

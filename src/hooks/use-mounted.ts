"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hindari hydration mismatch untuk nilai yang bergantung localStorage.
 * Pola resmi React tanpa effect: snapshot server = false, snapshot client = true.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

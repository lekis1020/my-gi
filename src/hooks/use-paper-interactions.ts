"use client";

import { useCallback, useEffect, useState } from "react";

const SAVED_KEY = "my-gi:saved-papers";
const READ_KEY = "my-gi:read-papers";
const CHANGE_EVENT = "paper-interactions-change";

export interface PaperInteractionData {
  pmid: string;
  title: string;
  journal_abbreviation: string;
  journal_color: string;
  journal_slug: string;
  publication_date: string;
  doi: string | null;
}

export interface SavedPaper extends PaperInteractionData {
  savedAt: number;
}

export interface ReadPaper extends PaperInteractionData {
  readAt: number;
}

function loadFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
}

export function useSavedPapers() {
  const [saved, setSaved] = useState<SavedPaper[]>([]);

  useEffect(() => {
    setSaved(loadFromStorage<SavedPaper>(SAVED_KEY));
    const handler = () => setSaved(loadFromStorage<SavedPaper>(SAVED_KEY));
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const isSaved = useCallback(
    (pmid: string) => saved.some((p) => p.pmid === pmid),
    [saved]
  );

  const toggleSave = useCallback((paper: PaperInteractionData) => {
    const current = loadFromStorage<SavedPaper>(SAVED_KEY);
    const exists = current.some((p) => p.pmid === paper.pmid);
    const updated = exists
      ? current.filter((p) => p.pmid !== paper.pmid)
      : [{ ...paper, savedAt: Date.now() }, ...current];
    saveToStorage(SAVED_KEY, updated);
    setSaved(updated);
  }, []);

  return { saved, isSaved, toggleSave, count: saved.length };
}

export function useReadPapers() {
  const [read, setRead] = useState<ReadPaper[]>([]);

  useEffect(() => {
    setRead(loadFromStorage<ReadPaper>(READ_KEY));
    const handler = () => setRead(loadFromStorage<ReadPaper>(READ_KEY));
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const isRead = useCallback(
    (pmid: string) => read.some((p) => p.pmid === pmid),
    [read]
  );

  const markAsRead = useCallback((paper: PaperInteractionData) => {
    const current = loadFromStorage<ReadPaper>(READ_KEY);
    if (current.some((p) => p.pmid === paper.pmid)) return;
    const updated = [{ ...paper, readAt: Date.now() }, ...current];
    saveToStorage(READ_KEY, updated);
    setRead(updated);
  }, []);

  return { read, isRead, markAsRead, count: read.length };
}

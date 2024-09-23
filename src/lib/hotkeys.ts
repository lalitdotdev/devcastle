"use client";

import { useHotkeys } from "react-hotkeys-hook";

export default function KeyboardShortcuts() {
  useHotkeys("ctrl+n", () => {
    window.location.href = "/cb/create";
  });
  useHotkeys("ctrl+t", () => {
    window.location.href = "/courses/new";
  });
  useHotkeys("ctrl+e", () => {
    window.location.href = "/articles/publish";
  });
  useHotkeys("ctrl+h", () => {
    window.location.href = "/startups/catalog/phfeed";
  });
  useHotkeys("ctrl+j", () => {
    window.location.href = "/jobs/new";
  });
  useHotkeys("ctrl+l", () => {
    window.location.href = "/launchpad/new-product";
  });

  return null;
}

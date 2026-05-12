"use client";

import { useEffect, useRef, useState } from "react";

const ENABLE_IN_DEVELOPMENT = false;

const WARNING_TEXT = "Akses ini dinonaktifkan untuk menjaga keamanan sistem.";

export default function SecurityGuard() {
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment && !ENABLE_IN_DEVELOPMENT) {
      return undefined;
    }

    function showWarning(text = WARNING_TEXT) {
      setMessage(text);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setMessage("");
      }, 2200);
    }

    function isEditableElement(target) {
      const tagName = String(target?.tagName || "").toLowerCase();

      return (
        tagName === "input" ||
        tagName === "textarea" ||
        target?.isContentEditable === true
      );
    }

    function blockEvent(event) {
      event.preventDefault();
      event.stopPropagation();
      showWarning();
      return false;
    }

    function handleContextMenu(event) {
      return blockEvent(event);
    }

    function handleCopyCut(event) {
      if (isEditableElement(event.target)) {
        return true;
      }

      return blockEvent(event);
    }

    function handleSelectStart(event) {
      if (isEditableElement(event.target)) {
        return true;
      }

      event.preventDefault();
      return false;
    }

    function handleDragStart(event) {
      event.preventDefault();
      return false;
    }

    function handleKeyDown(event) {
      const key = String(event.key || "").toLowerCase();

      const ctrl = event.ctrlKey;
      const shift = event.shiftKey;
      const alt = event.altKey;
      const meta = event.metaKey;

      const blockedKeys = [
        key === "f12",

        ctrl && shift && key === "i",
        ctrl && shift && key === "j",
        ctrl && shift && key === "c",
        ctrl && shift && key === "k",
        ctrl && shift && key === "m",

        ctrl && key === "u",
        ctrl && key === "s",
        ctrl && key === "p",

        meta && alt && key === "i",
        meta && alt && key === "j",
        meta && alt && key === "c",
        meta && key === "u",
        meta && key === "s",
        meta && key === "p",
      ];

      if (blockedKeys.some(Boolean)) {
        event.preventDefault();
        event.stopPropagation();
        showWarning();
        return false;
      }

      return true;
    }

    const style = document.createElement("style");
    style.setAttribute("data-security-guard", "true");
    style.innerHTML = `
      body.security-guard-active {
        -webkit-touch-callout: none;
      }

      body.security-guard-active *:not(input):not(textarea) {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      body.security-guard-active img,
      body.security-guard-active svg {
        -webkit-user-drag: none;
        user-drag: none;
      }

      body.security-guard-active input,
      body.security-guard-active textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;

    document.head.appendChild(style);
    document.body.classList.add("security-guard-active");

    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("selectstart", handleSelectStart, true);
    document.addEventListener("copy", handleCopyCut, true);
    document.addEventListener("cut", handleCopyCut, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
      document.removeEventListener("copy", handleCopyCut, true);
      document.removeEventListener("cut", handleCopyCut, true);

      document.body.classList.remove("security-guard-active");

      const existingStyle = document.querySelector(
        "style[data-security-guard='true']"
      );

      if (existingStyle) {
        existingStyle.remove();
      }

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[99999] -translate-x-1/2 rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-xs font-black text-slate-800 shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-slate-900 dark:text-white">
      {message}
    </div>
  );
}
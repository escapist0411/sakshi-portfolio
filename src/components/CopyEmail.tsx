"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

function copyWithSelection(email: string) {
  const active = document.activeElement;
  const selection = window.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : [];
  const field = document.createElement("textarea");
  field.value = email;
  field.readOnly = true;
  field.tabIndex = -1;
  field.setAttribute("aria-label", "Email address");
  Object.assign(field.style, { position: "fixed", top: "0", left: "0", opacity: "0", pointerEvents: "none" });
  document.body.append(field);

  try {
    field.focus({ preventScroll: true });
    field.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
    if (active instanceof HTMLElement) active.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach(range => selection.addRange(range));
    }
  }
}

export default function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<number | undefined>(undefined);
  const request = useRef(0);

  useEffect(() => () => {
    window.clearTimeout(timer.current);
    request.current++;
  }, []);

  async function copy() {
    const attempt = ++request.current;
    window.clearTimeout(timer.current);
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch {
      // Older browsers and restricted contexts can sometimes copy an active selection.
    }
    if (attempt !== request.current) return;
    if (!copied) copied = copyWithSelection(email);
    setStatus(copied ? "copied" : "error");
    if (copied) timer.current = window.setTimeout(() => setStatus("idle"), 2400);
  }

  return (
    <div className="copy-control">
      <button type="button" className="button button-secondary" onClick={copy}>
        {status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {status === "copied" ? "COPIED" : "COPY EMAIL"}
      </button>
      <span className={status === "error" ? "copy-status" : "sr-only"} role="status">
        {status === "error" ? "Copy the email address from the contact card." : status === "copied" ? "Email copied to clipboard." : ""}
      </span>
    </div>
  );
}

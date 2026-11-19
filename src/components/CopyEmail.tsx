"use client";
import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
export default function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() { try { await navigator.clipboard.writeText(email); setStatus("copied"); } catch { setStatus("error"); } if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setStatus("idle"), 3000); }
  return <div className="copy-control"><button className="button button-secondary" onClick={copy}>{status === "copied" ? <Check size={16} /> : <Copy size={16} />}{status === "copied" ? "COPIED" : "COPY EMAIL"}</button><span className="copy-status" role="status">{status === "error" ? "Couldn’t copy. Select the email in the card." : status === "copied" ? "Email copied to clipboard." : ""}</span></div>;
}

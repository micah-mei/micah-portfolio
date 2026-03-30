"use client";

import { useState, FormEvent } from "react";
import { ContactSocialLinks } from "@/components/ContactSocialLinks";

export function NetworkFooter() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const raw = await res.text();
      let data: { error?: string; ok?: boolean } = {};
      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        data = {
          error: `HTTP ${res.status}${raw ? `: ${raw.slice(0, 160)}` : ""}`,
        };
      }
      if (!res.ok) {
        setStatus("err");
        setMsg(
          data.error?.replace(/\s+/g, " ").trim() ||
            `send_failed — HTTP ${res.status}`,
        );
        return;
      }
      setStatus("ok");
      setMsg("packet_sent — thanks, I will reply shortly.");
      try {
        form.reset();
      } catch {
        /* form may be detached after async work */
      }
    } catch (err) {
      setStatus("err");
      const detail =
        err instanceof Error ? err.message.replace(/\s+/g, " ").trim() : "";
      setMsg(
        detail
          ? `send_failed — ${detail}`
          : "send_failed — could not reach server. Is the dev server running?",
      );
    }
  }

  return (
    <footer
      id="contact"
      className="relative z-20 scroll-mt-6 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-xl">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/contact
        </h2>
        <p className="mt-3 font-mono text-sm text-silver/55">
          ./contact — delivers to inbox (Resend)
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 font-mono text-sm"
        >
          <label className="block">
            <span className="text-cyan/80">--name</span>
            <input
              name="name"
              required
              autoComplete="name"
              className="mt-1 w-full border border-white/15 bg-black/50 px-3 py-2 text-silver outline-none ring-cyan/30 transition placeholder:text-silver/25 focus:border-cyan/40 focus:ring-1"
              placeholder="Ada Lovelace"
            />
          </label>
          <label className="block">
            <span className="text-cyan/80">--reply-to</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full border border-white/15 bg-black/50 px-3 py-2 text-silver outline-none ring-cyan/30 transition placeholder:text-silver/25 focus:border-cyan/40 focus:ring-1"
              placeholder="you@domain.com"
            />
          </label>
          <label className="block">
            <span className="text-cyan/80">--body</span>
            <textarea
              name="message"
              required
              rows={4}
              className="mt-1 w-full resize-y border border-white/15 bg-black/50 px-3 py-2 text-silver outline-none ring-cyan/30 transition placeholder:text-silver/25 focus:border-cyan/40 focus:ring-1"
              placeholder="Your message…"
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="border border-cyan/40 bg-cyan/10 px-4 py-2 text-cyan transition hover:bg-cyan/20 disabled:opacity-50"
          >
            {status === "sending" ? "./transmit…" : "./send.sh"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 font-mono text-xs ${
              status === "ok" ? "text-cyan/80" : "text-red-400/90"
            }`}
          >
            {msg}
          </p>
        )}

        <ContactSocialLinks />

        <p className="mt-10 max-w-lg font-mono text-xs leading-relaxed text-silver/45 md:mt-12">
          Based in London, ON, Canada. Authorized to work for any US employer.
        </p>
      </div>
    </footer>
  );
}

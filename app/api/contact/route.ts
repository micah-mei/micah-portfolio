import { Resend } from "resend";
import { NextResponse } from "next/server";

import { DEFAULT_CONTACT_EMAIL } from "@/lib/contactInbox";

/** Resend SDK expects Node APIs; avoids Edge env/runtime quirks on Vercel. */
export const runtime = "nodejs";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const MAX = { name: 200, email: 254, message: 12_000 };

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeErrorMessage(s: string, max = 280) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function inboundEmail(): string {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    DEFAULT_CONTACT_EMAIL
  );
}

function missingResendKey(): NextResponse {
  const onVercel = Boolean(process.env.VERCEL);
  const error = onVercel
    ? "Email sending is not configured: add RESEND_API_KEY from the Resend dashboard under Project → Settings → Environment Variables, then redeploy."
    : "Email not configured: add RESEND_API_KEY to .env.local, then restart npm run dev.";
  return NextResponse.json({ error }, { status: 503 });
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = inboundEmail();

  if (!apiKey) {
    return missingResendKey();
  }

  let name: string;
  let email: string;
  let message: string;

  try {
    const body = await req.json();
    name = String(body?.name ?? "").trim();
    email = String(body?.email ?? "").trim();
    message = String(body?.message ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing name, email, or message." }, {
      status: 400,
    });
  }

  if (name.length > MAX.name || email.length > MAX.email) {
    return NextResponse.json({ error: "Name or email is too long." }, {
      status: 400,
    });
  }

  if (message.length > MAX.message) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, {
      status: 400,
    });
  }

  const from =
    process.env.CONTACT_FROM?.trim() ||
    "Micah Portfolio <onboarding@resend.dev>";

  const subject = `Portfolio contact: ${name.slice(0, 72)}`;
  const text = `From: ${name} <${email}>\n\n${message}`;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const html = `
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <hr style="border:none;border-top:1px solid #333;margin:16px 0" />
      <p style="white-space:pre-wrap;font-family:system-ui,sans-serif">${safeMessage}</p>
    `;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[contact] Resend:", error);
      const hint =
        error.name === "validation_error" || error.message.includes("testing")
          ? " With onboarding@resend.dev, Resend often only delivers to the email on your Resend account — set CONTACT_TO_EMAIL to that address, or verify a domain and CONTACT_FROM."
          : "";
      return NextResponse.json(
        {
          error: safeErrorMessage(
            `${error.message} (${error.name}).${hint}`,
            400,
          ),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error("[contact] send threw:", e);
    const m = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: safeErrorMessage(`Send failed: ${m}`) },
      { status: 502 },
    );
  }
}

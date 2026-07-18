"use server";

import * as React from "react";

import { insertEnquiry, type EnquiryInput } from "@/lib/db";
import { Resend } from "resend";
import EnquiryEmail from "@/components/emails/EnquiryEmail";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type EnquiryResult = { ok: boolean; error?: string };

/** Persist a contact-form enquiry. Called from the client before opening WhatsApp. */
export async function submitEnquiry(
  input: EnquiryInput
): Promise<EnquiryResult> {
  const name = input.name?.trim();
  const contact = input.contact?.trim();
  if (!name || !contact) {
    return { ok: false, error: "Name and contact are required." };
  }
  try {
    await insertEnquiry({
      name,
      company: input.company?.trim() || undefined,
      contact,
      eventType: input.eventType || undefined,
      message: input.message?.trim() || undefined,
    });

    if (resend && process.env.CONTACT_EMAIL_TO) {
      await resend.emails.send({
        from: "Nova Events <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL_TO,
        subject: `New Enquiry from ${name}`,
        react: EnquiryEmail({
          name,
          company: input.company?.trim(),
          contact,
          eventType: input.eventType,
          message: input.message?.trim(),
        }) as React.ReactElement,
      });
    }

    return { ok: true };
  } catch (err) {
    console.error("submitEnquiry failed:", err);
    return { ok: false, error: "Could not save enquiry." };
  }
}

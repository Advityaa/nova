"use server";

import * as React from "react";

import { insertEnquiry, type EnquiryInput } from "@/lib/db";
import { Resend } from "resend";
import EnquiryEmail from "@/components/emails/EnquiryEmail";

const RESEND_KEY = process.env.RESEND_API_KEY || "re_4kUeVAVf_2EsfgE72VoC5r3inBJdXLPm8";
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

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
      email: input.email?.trim() || undefined,
      contact,
      eventType: input.eventType || undefined,
      message: input.message?.trim() || undefined,
    });

    const CONTACT_TO = process.env.CONTACT_EMAIL_TO || "agarwaldarpan5@outlook.com";
    if (resend && CONTACT_TO) {
      try {
        const resendResult = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: CONTACT_TO,
        subject: `New Enquiry from ${name}`,
        react: EnquiryEmail({
          name,
          company: input.company?.trim(),
          email: input.email?.trim(),
          contact,
          eventType: input.eventType,
          message: input.message?.trim(),
        }) as React.ReactElement,
      });
      if (resendResult.error) {
        console.error("Resend API returned error:", resendResult.error);
      }
      } catch (err) {
        console.error("Resend failed to send:", err);
      }
    }

    return { ok: true };
  } catch (err) {
    console.error("submitEnquiry failed:", err);
    return { ok: false, error: "Could not save enquiry." };
  }
}

"use server";

import { insertEnquiry, type EnquiryInput } from "@/lib/db";

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
    return { ok: true };
  } catch (err) {
    console.error("submitEnquiry failed:", err);
    return { ok: false, error: "Could not save enquiry." };
  }
}

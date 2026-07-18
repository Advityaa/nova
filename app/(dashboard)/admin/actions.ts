"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import {
  addGalleryImageAdmin,
  addTierAdmin,
  countOwners,
  createEventAdmin,
  createUserAdmin,
  deleteEventAdmin,
  deleteGalleryImageAdmin,
  deleteTierAdmin,
  deleteUserAdmin,
  getUserByEmail,
  setEnquiryHandledAdmin,
  updateEventAdmin,
  updateGalleryImageAdmin,
  updateTierAdmin,
  updateUserPasswordAdmin,
  type EventInput,
  type TierInput,
} from "@/lib/db";

export type FormState = { error?: string; ok?: boolean } | undefined;

// ---- guards ----
async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}
async function requireOwner() {
  const session = await requireSession();
  if (session.user.role !== "owner") {
    throw new Error("Owner access required.");
  }
  return session;
}

// ---- helpers ----
function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function nullable(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}
function usdToFen(v: string): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 800);
}
function intOrNull(v: string): number | null {
  if (v.trim() === "") return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function parseColor(v: string, def: string): string {
  v = v.trim();
  if (!v) return def;
  if (!v.startsWith("#")) return "#" + v;
  return v;
}

function readEventInput(fd: FormData): EventInput {
  return {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    type: str(fd, "type") || "Event",
    color: parseColor(str(fd, "color"), "#864bff"),
    accent_ink: parseColor(str(fd, "accent_ink"), "#ffffff"),
    lineup: nullable(fd, "lineup"),
    venue: nullable(fd, "venue"),
    area: nullable(fd, "area"),
    address: nullable(fd, "address"),
    weekday: nullable(fd, "weekday"),
    starts_at: nullable(fd, "starts_at"),
    doors: nullable(fd, "doors"),
    status: str(fd, "status") || "draft",
    status_label: nullable(fd, "status_label"),
    hero_image: nullable(fd, "hero_image"),
    description: nullable(fd, "description"),
    featured: fd.get("featured") === "on" || fd.get("featured") === "true",
  };
}

// ============================================================
// Events
// ============================================================
export async function saveEvent(
  _prev: FormState,
  fd: FormData
): Promise<FormState> {
  await requireSession();
  const id = str(fd, "id");
  const input = readEventInput(fd);
  if (!input.slug || !input.name) {
    return { error: "Slug and name are required." };
  }
  try {
    if (id) await updateEventAdmin(id, input);
    else await createEventAdmin(input);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/unique|duplicate/i.test(msg)) return { error: `Slug "${input.slug}" is already taken.` };
    return { error: "Could not save event." };
  }
  revalidatePath("/", "layout");
  redirect("/admin/events");
}

export async function deleteEvent(fd: FormData): Promise<void> {
  await requireSession();
  const id = str(fd, "id");
  if (id) {
    await deleteEventAdmin(id);
    revalidatePath("/", "layout");
  }
}

// ============================================================
// Tiers
// ============================================================
export async function saveTier(fd: FormData): Promise<void> {
  await requireSession();
  const tierId = str(fd, "tier_id");
  const eventId = str(fd, "event_id");
  const input: TierInput = {
    name: str(fd, "name") || "Ticket",
    description: nullable(fd, "description"),
    price_fen: usdToFen(str(fd, "price")),
    capacity: intOrNull(str(fd, "capacity")),
    sort: intOrNull(str(fd, "sort")) ?? 0,
  };
  if (tierId) await updateTierAdmin(tierId, input);
  else if (eventId) await addTierAdmin(eventId, input);
  revalidatePath("/", "layout");
}

export async function deleteTier(fd: FormData): Promise<void> {
  await requireSession();
  const tierId = str(fd, "tier_id");
  const eventId = str(fd, "event_id");
  if (tierId) await deleteTierAdmin(tierId);
  revalidatePath("/", "layout");
}

// ============================================================
// Gallery
// ============================================================
export async function addGallery(
  _prev: FormState,
  fd: FormData
): Promise<FormState> {
  await requireSession();
  const urlsText = str(fd, "urls");
  const eventId = nullable(fd, "event_id");
  const caption = nullable(fd, "caption");
  let sort = intOrNull(str(fd, "sort")) ?? 0;

  if (!urlsText) return { error: "At least one Image URL is required." };
  
  const urls = urlsText.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
  
  for (const url of urls) {
    await addGalleryImageAdmin(url, caption, sort, eventId);
    sort++;
  }
  
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateGallery(fd: FormData): Promise<void> {
  await requireSession();
  const id = str(fd, "id");
  if (id) {
    await updateGalleryImageAdmin(id, nullable(fd, "caption"), intOrNull(str(fd, "sort")) ?? 0);
    revalidatePath("/", "layout");
  }
}

export async function deleteGallery(fd: FormData): Promise<void> {
  await requireSession();
  const id = str(fd, "id");
  if (id) {
    await deleteGalleryImageAdmin(id);
    revalidatePath("/", "layout");
  }
}

// ============================================================
// Enquiries
// ============================================================
export async function toggleEnquiry(fd: FormData): Promise<void> {
  await requireSession();
  const id = str(fd, "id");
  const handled = str(fd, "handled") === "true";
  if (id) {
    await setEnquiryHandledAdmin(id, handled);
    revalidatePath("/", "layout");
  }
}

// ============================================================
// Team / settings (owner-gated where noted)
// ============================================================
export async function createAdmin(
  _prev: FormState,
  fd: FormData
): Promise<FormState> {
  await requireOwner();
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  const role = str(fd, "role") === "owner" ? "owner" : "admin";
  const name = nullable(fd, "name");
  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (await getUserByEmail(email)) return { error: "A user with that email already exists." };
  const hash = await bcrypt.hash(password, 10);
  await createUserAdmin(email, hash, role, name);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteTeamMember(fd: FormData): Promise<void> {
  const session = await requireOwner();
  const id = str(fd, "id");
  if (!id) return;
  // Don't allow deleting yourself or the last owner.
  if (id === session.user.id) return;
  if (str(fd, "role") === "owner" && (await countOwners()) <= 1) return;
  await deleteUserAdmin(id);
  revalidatePath("/", "layout");
}

export async function changeOwnPassword(
  _prev: FormState,
  fd: FormData
): Promise<FormState> {
  const session = await requireSession();
  const current = str(fd, "current");
  const next = str(fd, "next");
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  const user = await getUserByEmail(session.user.email ?? "");
  if (!user) return { error: "User not found." };
  const valid = await bcrypt.compare(current, user.password_hash);
  if (!valid) return { error: "Current password is incorrect." };
  const hash = await bcrypt.hash(next, 10);
  await updateUserPasswordAdmin(user.id, hash);
  return { ok: true };
}

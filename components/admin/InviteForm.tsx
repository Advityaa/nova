"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createAdmin, type FormState } from "@/app/(dashboard)/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn admin-btn-inline" disabled={pending}>
      {pending ? "Creating…" : "Create user"}
    </button>
  );
}

export default function InviteForm() {
  const [state, action] = useFormState<FormState, FormData>(createAdmin, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="invite-form">
      <input name="name" placeholder="Name" />
      <input name="email" type="email" placeholder="email@novaevents.sh" required />
      <input name="password" type="password" placeholder="Temp password (min 8)" required minLength={8} />
      <select name="role" defaultValue="admin">
        <option value="admin">admin</option>
        <option value="owner">owner</option>
      </select>
      <Submit />
      {state?.error && <div className="admin-error" style={{ width: "100%" }}>{state.error}</div>}
      {state?.ok && <div className="admin-ok" style={{ width: "100%" }}>User created.</div>}
    </form>
  );
}

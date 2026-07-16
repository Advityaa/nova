"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { changeOwnPassword, type FormState } from "@/app/(dashboard)/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn" disabled={pending}>
      {pending ? "Updating…" : "Update password"}
    </button>
  );
}

export default function PasswordForm() {
  const [state, action] = useFormState<FormState, FormData>(changeOwnPassword, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="admin-form" style={{ maxWidth: 360 }}>
      <label>
        <span>Current password</span>
        <input type="password" name="current" autoComplete="current-password" required />
      </label>
      <label>
        <span>New password (min 8)</span>
        <input type="password" name="next" autoComplete="new-password" required minLength={8} />
      </label>
      {state?.error && <div className="admin-error">{state.error}</div>}
      {state?.ok && <div className="admin-ok">Password updated.</div>}
      <Submit />
    </form>
  );
}

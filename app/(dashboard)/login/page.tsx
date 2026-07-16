"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <div className="admin-auth">
      <div className="admin-auth-card">
        <div className="admin-brand">
          NOVA<span>/ ADMIN</span>
        </div>
        <h1 className="admin-auth-title">Sign in</h1>
        <p className="admin-auth-sub">
          Team access only. Manage events, gallery and enquiries.
        </p>

        <form action={formAction} className="admin-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@novaevents.sh"
              autoComplete="username"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {state?.error && <div className="admin-error">{state.error}</div>}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

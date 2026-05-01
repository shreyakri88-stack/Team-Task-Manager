import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] glass-panel lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[620px] overflow-hidden bg-pink-600 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
            alt="Team collaborating around a bright workspace"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-700/88 via-rose-500/65 to-fuchsia-600/70" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sm font-black text-pink-600 shadow-xl">
                TM
              </span>
              <div>
                <p className="text-xl font-extrabold">Team Task Manager</p>
                <p className="text-sm text-pink-100">Plan, assign, celebrate.</p>
              </div>
            </div>
            <div className="floaty max-w-md rounded-3xl border border-white/25 bg-white/15 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-100">work beautifully</p>
              <h1 className="mt-3 text-5xl font-black leading-tight">Turn busy teams into focused flow.</h1>
              <p className="mt-4 text-pink-50">
                A softer, brighter command center for tasks, projects, owners, and deadlines.
              </p>
            </div>
          </div>
        </section>
        <form onSubmit={onSubmit} className="p-8 sm:p-12">
          <div className="mb-8 lg:hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-pink-300/60">
              TM
            </span>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-pink-500">welcome back</p>
          <h2 className="mt-2 text-4xl font-black text-slate-950">Login</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Continue to your pink-powered project workspace.
          </p>
          {error && <p className="mt-6 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <div className="mt-8 space-y-4">
        <input
          className="soft-input"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="soft-input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button
          disabled={submitting}
          className="pink-button w-full"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
          </div>
        <p className="mt-6 text-sm text-slate-600">
          No account?{" "}
          <Link className="font-semibold text-pink-600 hover:text-pink-700 hover:underline" to="/signup">
            Create one
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] glass-panel lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={onSubmit} className="p-8 sm:p-12">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-pink-300/60">
            TM
          </span>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-pink-500">join the workspace</p>
          <h2 className="mt-2 text-4xl font-black text-slate-950">Create account</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Build a task board that feels clear, colorful, and ready for action.
          </p>
          {error && <p className="mt-6 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <div className="mt-8 space-y-4">
        <input
          className="soft-input"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={onChange}
          required
        />
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
          minLength={6}
          required
        />
        <select className="soft-input" name="role" value={form.role} onChange={onChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          disabled={submitting}
          className="pink-button w-full"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
          </div>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-pink-600 hover:text-pink-700 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
        <section className="relative hidden min-h-[620px] overflow-hidden bg-pink-600 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
            alt="Team planning projects with sticky notes"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/80 via-pink-500/70 to-rose-500/75" />
          <div className="relative flex h-full flex-col justify-end p-10 text-white">
            <div className="floaty rounded-3xl border border-white/25 bg-white/15 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-100">team rhythm</p>
              <h1 className="mt-3 text-5xl font-black leading-tight">Create, assign, and move work forward.</h1>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm font-semibold">
                <span className="rounded-2xl bg-white/20 p-3">Projects</span>
                <span className="rounded-2xl bg-white/20 p-3">Tasks</span>
                <span className="rounded-2xl bg-white/20 p-3">Teams</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignupPage;

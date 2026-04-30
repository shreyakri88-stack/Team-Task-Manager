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
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-semibold">Create account</h2>
        {error && <p className="mb-4 rounded bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}
        <input
          className="mb-3 w-full rounded border p-2"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          className="mb-3 w-full rounded border p-2"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="mb-3 w-full rounded border p-2"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          minLength={6}
          required
        />
        <select className="mb-4 w-full rounded border p-2" name="role" value={form.role} onChange={onChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          disabled={submitting}
          className="w-full rounded bg-indigo-600 p-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="text-indigo-600 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;

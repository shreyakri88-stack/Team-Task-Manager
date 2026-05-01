import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const statCards = [
  { key: "totalTasks", label: "Total Tasks", accent: "from-pink-500 to-fuchsia-500", helper: "All active work" },
  { key: "completedTasks", label: "Completed", accent: "from-emerald-400 to-teal-500", helper: "Finished with love" },
  { key: "overdueTasks", label: "Overdue", accent: "from-rose-500 to-orange-400", helper: "Needs attention" },
  { key: "completionRate", label: "Completion Rate", accent: "from-violet-500 to-pink-500", helper: "Momentum score", suffix: "%" },
];

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosClient.get("/dashboard");
        setStats(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="glass-panel rounded-2xl p-5 text-slate-600">Loading dashboard...</p>;
  if (error) return <p className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-rose-700 shadow-lg shadow-rose-100">{error}</p>;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-pink-200">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80"
          alt="Creative team planning at a desk"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-pink-950/80 to-pink-600/60" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-pink-200">dashboard</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Your team command center just got prettier.</h1>
          <p className="mt-4 text-sm leading-6 text-pink-50">
            Track workload, spot overdue tasks, and keep your completion rhythm visible at a glance.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="soft-card">
            <div className={`mb-5 h-2 w-16 rounded-full bg-gradient-to-r ${card.accent}`} />
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <p className="mt-2 text-4xl font-black text-slate-950">
              {stats[card.key]}
              {card.suffix || ""}
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-pink-400">{card.helper}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

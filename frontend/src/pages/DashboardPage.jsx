import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const cardClass = "rounded-lg bg-white p-5 shadow";

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

  if (loading) return <p className="p-4 text-slate-600">Loading dashboard...</p>;
  if (error) return <p className="rounded bg-rose-50 p-4 text-rose-700">{error}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className={cardClass}>
        <p className="text-sm text-slate-500">Total Tasks</p>
        <p className="text-3xl font-semibold">{stats.totalTasks}</p>
      </div>
      <div className={cardClass}>
        <p className="text-sm text-slate-500">Completed</p>
        <p className="text-3xl font-semibold text-emerald-600">{stats.completedTasks}</p>
      </div>
      <div className={cardClass}>
        <p className="text-sm text-slate-500">Overdue</p>
        <p className="text-3xl font-semibold text-rose-600">{stats.overdueTasks}</p>
      </div>
      <div className={cardClass}>
        <p className="text-sm text-slate-500">Completion Rate</p>
        <p className="text-3xl font-semibold">{stats.completionRate}%</p>
      </div>
    </div>
  );
};

export default DashboardPage;

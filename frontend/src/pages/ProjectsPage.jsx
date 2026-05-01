import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const statusColor = {
  todo: "bg-pink-100 text-pink-700",
  "in-progress": "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

const columnStyle = {
  todo: "border-pink-100 bg-pink-50/80",
  "in-progress": "border-amber-100 bg-amber-50/80",
  done: "border-emerald-100 bg-emerald-50/80",
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === selectedProjectId),
    [projects, selectedProjectId]
  );

  const assignableMembers = useMemo(() => {
    if (!selectedProject) return [];
    const map = new Map();
    [selectedProject.createdBy, ...(selectedProject.members || [])].forEach((member) => {
      if (member?._id && !map.has(member._id)) map.set(member._id, member);
    });
    return Array.from(map.values());
  }, [selectedProject]);

  const loadProjects = async () => {
    const { data } = await axiosClient.get("/projects");
    setProjects(data);
    if (!data.length) {
      setSelectedProjectId("");
      setTasks([]);
      return;
    }
    if (!selectedProjectId || !data.some((project) => project._id === selectedProjectId)) {
      setSelectedProjectId(data[0]._id);
    }
  };

  const loadUsers = async () => {
    if (user.role !== "admin") return;
    const { data } = await axiosClient.get("/users");
    setUsers(data);
  };

  const loadTasks = async (projectId) => {
    if (!projectId) return;
    const { data } = await axiosClient.get(`/tasks/${projectId}`);
    setTasks(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([loadProjects(), loadUsers()]);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        await loadTasks(selectedProjectId);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load tasks");
      }
    };
    run();
  }, [selectedProjectId]);

  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const { data } = await axiosClient.post("/projects", projectForm);
      setProjectForm({ name: "", description: "" });
      setSuccess("Project created successfully.");
      await loadProjects();
      setSelectedProjectId(data._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create project");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedProjectId) return;
    try {
      await axiosClient.post("/tasks", { ...taskForm, projectId: selectedProjectId });
      setTaskForm({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
      await loadTasks(selectedProjectId);
      setSuccess("Task created successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    setError("");
    setSuccess("");
    try {
      await axiosClient.put(`/tasks/${taskId}`, { status });
      await loadTasks(selectedProjectId);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update task");
    }
  };

  if (loading) {
    return <p className="glass-panel rounded-2xl p-5 text-slate-600">Loading projects...</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-lg shadow-rose-100">
          <p>{error}</p>
          <button type="button" className="text-sm underline" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}
      {success && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-lg shadow-emerald-100">
          <p>{success}</p>
          <button type="button" className="text-sm underline" onClick={() => setSuccess("")}>
            Dismiss
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-pink-200">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80"
          alt="Project team reviewing a colorful board"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-pink-950/75 to-rose-500/60" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-pink-200">projects workspace</p>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Plan work with color, clarity, and momentum.</h2>
          <p className="mt-4 text-sm leading-6 text-pink-50">
            Signed in as <span className="font-semibold">{user?.name}</span> ({user?.role}).
            {user?.role !== "admin"
              ? " Only admins can create new projects."
              : " You can create projects, add members, and keep the board moving."}
          </p>
        </div>
      </section>

      {user.role === "admin" && (
        <section className="soft-card">
          <h2 className="mb-3 text-xl font-black text-slate-950">Create Project</h2>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={createProject}>
            <input
              className="soft-input"
              placeholder="Project name"
              value={projectForm.name}
              onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              className="soft-input"
              placeholder="Description"
              value={projectForm.description}
              onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
            />
            <button className="pink-button md:col-span-2">
              Create Project
            </button>
          </form>
        </section>
      )}

      <section className="soft-card">
        <h2 className="mb-3 text-xl font-black text-slate-950">Projects</h2>
        {!projects.length && (
          <p className="rounded-2xl bg-pink-50 p-4 text-sm text-slate-600">
            No projects yet. {user.role === "admin" ? "Create your first project above." : "Ask an admin to assign you to a project."}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <button
              key={project._id}
              type="button"
              onClick={() => setSelectedProjectId(project._id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedProjectId === project._id
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-200"
                  : "bg-pink-50 text-pink-700 hover:bg-pink-100"
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>
      </section>

      {selectedProject && (
        <>
          <section className="soft-card">
            <h2 className="mb-3 text-xl font-black text-slate-950">Create Task</h2>
            <p className="mb-3 text-sm text-slate-600">
              Selected project: <span className="font-medium">{selectedProject.name}</span>
            </p>
            <form className="grid gap-3 md:grid-cols-3" onSubmit={createTask}>
              <input
                className="soft-input"
                placeholder="Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <input
                className="soft-input"
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
              />
              <select
                className="soft-input"
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm((p) => ({ ...p, assignedTo: e.target.value }))}
                required
              >
                <option value="">Assign user</option>
                {assignableMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              <select
                className="soft-input"
                value={taskForm.status}
                onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <select
                className="soft-input"
                value={taskForm.priority}
                onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                className="soft-input"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
              />
              <button className="pink-button md:col-span-3">
                Add Task
              </button>
            </form>
          </section>

          {user.role === "admin" && users.length > 0 && (
            <section className="soft-card">
              <h2 className="mb-3 text-xl font-black text-slate-950">Add Member to Selected Project</h2>
              <div className="flex flex-wrap gap-2">
                {users.map((candidate) => (
                  <button
                    key={candidate._id}
                    type="button"
                    onClick={async () => {
                      try {
                        setError("");
                        setSuccess("");
                        await axiosClient.post(`/projects/${selectedProjectId}/add-member`, {
                          userId: candidate._id,
                        });
                        await loadProjects();
                        setSuccess(`Added ${candidate.name} to project.`);
                      } catch (err) {
                        setError(err?.response?.data?.message || "Failed to add member");
                      }
                    }}
                    className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 transition hover:-translate-y-0.5 hover:bg-pink-100"
                  >
                    {candidate.name} ({candidate.role})
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="soft-card">
            <h2 className="mb-3 text-xl font-black text-slate-950">Task Board</h2>
            {!tasks.length && (
              <p className="rounded-2xl bg-pink-50 p-4 text-sm text-slate-600">
                No tasks in this project yet.
              </p>
            )}
            <div className="grid gap-4 lg:grid-cols-3">
              {["todo", "in-progress", "done"].map((column) => (
                <div key={column} className={`rounded-2xl border p-4 ${columnStyle[column]}`}>
                  <h3 className="mb-3 font-black capitalize text-slate-800">{column.replace("-", " ")}</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter((task) => task.status === column)
                      .map((task) => (
                        <div key={task._id} className="rounded-2xl bg-white p-4 shadow-md shadow-pink-100/60 transition hover:-translate-y-1 hover:shadow-lg">
                          <p className="font-bold text-slate-950">{task.title}</p>
                          <p className="text-sm text-slate-600">{task.description}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Assigned: {task.assignedTo?.name || "N/A"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
                          </p>
                          <span
                            className={`mt-2 inline-block rounded px-2 py-1 text-xs ${
                              statusColor[task.status]
                            }`}
                          >
                            {task.status}
                          </span>
                          <div className="mt-3 flex gap-2">
                            {["todo", "in-progress", "done"].map((nextStatus) => (
                              <button
                                key={nextStatus}
                                type="button"
                                disabled={task.status === nextStatus}
                                onClick={() => updateTaskStatus(task._id, nextStatus)}
                                className="rounded-full border border-pink-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-pink-300 hover:text-pink-700 disabled:opacity-40"
                              >
                                {nextStatus}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProjectsPage;

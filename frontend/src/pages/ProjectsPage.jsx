import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const statusColor = {
  todo: "bg-slate-100 text-slate-700",
  "in-progress": "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
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

  const loadProjects = async () => {
    const { data } = await axiosClient.get("/projects");
    setProjects(data);
    if (!selectedProjectId && data.length) setSelectedProjectId(data[0]._id);
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
    try {
      await axiosClient.post("/projects", projectForm);
      setProjectForm({ name: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create project");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="space-y-5">
      {error && <p className="rounded bg-rose-50 p-3 text-rose-700">{error}</p>}

      {user.role === "admin" && (
        <section className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Create Project</h2>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={createProject}>
            <input
              className="rounded border p-2"
              placeholder="Project name"
              value={projectForm.name}
              onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              className="rounded border p-2"
              placeholder="Description"
              value={projectForm.description}
              onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
            />
            <button className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
              Create
            </button>
          </form>
        </section>
      )}

      <section className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Projects</h2>
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <button
              key={project._id}
              type="button"
              onClick={() => setSelectedProjectId(project._id)}
              className={`rounded px-3 py-2 text-sm ${
                selectedProjectId === project._id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>
      </section>

      {selectedProject && (
        <>
          <section className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold">Create Task</h2>
            <form className="grid gap-3 md:grid-cols-3" onSubmit={createTask}>
              <input
                className="rounded border p-2"
                placeholder="Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <input
                className="rounded border p-2"
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
              />
              <select
                className="rounded border p-2"
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm((p) => ({ ...p, assignedTo: e.target.value }))}
                required
              >
                <option value="">Assign user</option>
                {[selectedProject.createdBy, ...(selectedProject.members || [])].map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              <select
                className="rounded border p-2"
                value={taskForm.status}
                onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <select
                className="rounded border p-2"
                value={taskForm.priority}
                onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                className="rounded border p-2"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
              />
              <button className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
                Add Task
              </button>
            </form>
          </section>

          {user.role === "admin" && users.length > 0 && (
            <section className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-3 text-lg font-semibold">Add Member to Selected Project</h2>
              <div className="flex flex-wrap gap-2">
                {users.map((candidate) => (
                  <button
                    key={candidate._id}
                    type="button"
                    onClick={async () => {
                      try {
                        await axiosClient.post(`/projects/${selectedProjectId}/add-member`, {
                          userId: candidate._id,
                        });
                        await loadProjects();
                      } catch (err) {
                        setError(err?.response?.data?.message || "Failed to add member");
                      }
                    }}
                    className="rounded bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
                  >
                    {candidate.name} ({candidate.role})
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold">Task Board</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {["todo", "in-progress", "done"].map((column) => (
                <div key={column} className="rounded border bg-slate-50 p-3">
                  <h3 className="mb-2 font-semibold capitalize">{column.replace("-", " ")}</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter((task) => task.status === column)
                      .map((task) => (
                        <div key={task._id} className="rounded bg-white p-3 shadow-sm">
                          <p className="font-medium">{task.title}</p>
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

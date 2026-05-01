import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 shadow-sm shadow-pink-100/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-pink-300/60">
            TM
          </span>
          <span>
            <span className="block text-lg font-extrabold text-slate-900">Team Task Manager</span>
            <span className="block text-xs font-medium uppercase tracking-[0.24em] text-pink-500">pro workspace</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link to="/dashboard" className="rounded-full px-3 py-2 font-medium text-slate-700 transition hover:bg-pink-100 hover:text-pink-700">
            Dashboard
          </Link>
          <Link to="/projects" className="rounded-full px-3 py-2 font-medium text-slate-700 transition hover:bg-pink-100 hover:text-pink-700">
            Projects
          </Link>
          <span className="rounded-full border border-pink-100 bg-pink-50 px-3 py-2 text-xs font-semibold text-pink-700">
            {user?.name} ({user?.role})
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-pink-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

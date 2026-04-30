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
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-800">Team Task Manager Pro</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="text-slate-700 hover:text-slate-900">
            Dashboard
          </Link>
          <Link to="/projects" className="text-slate-700 hover:text-slate-900">
            Projects
          </Link>
          <span className="rounded bg-slate-100 px-3 py-1 text-slate-700">
            {user?.name} ({user?.role})
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded bg-rose-500 px-3 py-1.5 font-medium text-white hover:bg-rose-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

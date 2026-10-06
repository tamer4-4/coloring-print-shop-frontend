import { useEffect } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardList, LogOut, ExternalLink } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  // 🛡️ الحماية: من غير token = ارجع للوجين
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/admin/login");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const links = [
    { to: "/admin", end: true, icon: LayoutDashboard, label: "لوحة التحكم" },
    { to: "/admin/books", icon: BookOpen, label: "الكتب" },
    { to: "/admin/orders", icon: ClipboardList, label: "الطلبات" },
  ];

  return (
    <div className="flex min-h-screen bg-snow">
      <aside className="w-60 bg-night text-white flex flex-col p-4 gap-2 sticky top-0 h-screen shrink-0">
        <Link to="/" className="font-head font-extrabold text-lg flex items-center gap-2 mb-4">
          <span className="flex">
            <span className="w-4 h-4 rounded-full bg-cyanx"></span>
            <span className="w-4 h-4 rounded-full bg-magenta -ms-1.5"></span>
            <span className="w-4 h-4 rounded-full bg-sun -ms-1.5"></span>
            <span className="w-4 h-4 rounded-full bg-white -ms-1.5"></span>
          </span>
          مِداد — أدمن
        </Link>

        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-sm transition ${
                isActive ? "bg-ink text-white" : "text-slate-300 hover:bg-white/10"
              }`}>
            <l.icon size={18} /> {l.label}
          </NavLink>
        ))}

        <div className="mt-auto space-y-2">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10 text-sm font-semibold">
            <ExternalLink size={18} /> عرض المتجر
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-300 hover:bg-red-500/20 text-sm font-semibold">
            <LogOut size={18} /> تسجيل خروج
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
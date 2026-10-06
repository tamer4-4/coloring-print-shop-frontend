import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/admin");
    } catch {
      setError("بيانات الدخول غلط — جرب تاني");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-8 w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <span className="w-5 h-5 rounded-full bg-cyanx ring-2 ring-white"></span>
            <span className="w-5 h-5 rounded-full bg-magenta ring-2 ring-white -ms-2"></span>
            <span className="w-5 h-5 rounded-full bg-sun ring-2 ring-white -ms-2"></span>
            <span className="w-5 h-5 rounded-full bg-night ring-2 ring-white -ms-2"></span>
          </div>
          <h1 className="font-head font-extrabold text-2xl">لوحة تحكم مِداد</h1>
          <p className="text-slate-500 text-sm mt-1">دخول الأدمن فقط 🔐</p>
        </div>

        <input required value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ink"
          placeholder="اسم المستخدم" />
        <input required type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ink"
          placeholder="كلمة السر" />

        {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

        <button disabled={loading}
          className="w-full bg-ink hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2">
          <Lock size={18} /> {loading ? "ثواني... ⏳" : "دخول"}
        </button>
      </form>
    </div>
  );
}
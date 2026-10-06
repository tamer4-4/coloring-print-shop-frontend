import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  ClipboardList, Banknote, Hourglass, BookOpen,
  CalendarDays, TrendingUp,
} from "lucide-react";
import { statusAr, statusBadge } from "../../utils/orderStatus";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/statistics")
      .then((r) => setStats(r.data))
      .catch(() => setError("فشل تحميل الإحصائيات"));
  }, []);

  if (error) return <p className="text-red-500 font-bold text-center py-20">{error}</p>;
  if (!stats) return <p className="text-center text-slate-500 py-20">جاري التحميل... ⏳</p>;

  const cards = [
    { label: "إجمالي الطلبات", value: stats.totalOrders, icon: ClipboardList, color: "bg-blue-100 text-ink" },
    { label: "طلبات النهاردة", value: stats.todaysOrders, icon: CalendarDays, color: "bg-cyan-100 text-cyan-700" },
    { label: "إيرادات مؤكدة", value: `${Number(stats.totalRevenue).toFixed(2)} ج.م`, icon: Banknote, color: "bg-emerald-100 text-emerald-600" },
    { label: "إيرادات منتظرة", value: `${Number(stats.pendingRevenue).toFixed(2)} ج.م`, icon: Hourglass, color: "bg-amber-100 text-amber-600" },
    { label: "كتب مباعة", value: stats.totalBooksSold, icon: BookOpen, color: "bg-violet-100 text-violet-600" },
  ];

  const medals = ["🥇", "", ""];

  return (
    <div className="space-y-8">
      <h1 className="font-head font-extrabold text-3xl">لوحة التحكم 📊</h1>

      {/* ══════════ كروت الأرقام ══════════ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl shadow p-5 flex items-center gap-3">
            <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${c.color}`}>
              <c.icon size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-semibold">{c.label}</p>
              <p className="font-head font-extrabold text-xl truncate">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════ الطلبات حسب الحالة ══════════ */}
      <section>
        <h2 className="font-head font-extrabold text-xl mb-4">الطلبات حسب الحالة</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
            <span key={status} className={`rounded-2xl px-6 py-3 font-bold text-sm ${statusBadge[status]}`}>
              {statusAr[status]} : {count}
            </span>
          ))}
          {Object.keys(stats.ordersByStatus || {}).length === 0 && (
            <p className="text-slate-400">مفيش طلبات لسه</p>
          )}
        </div>
      </section>

      {/* ══════════ الأكثر مبيعاً ══════════ */}
      <section>
        <h2 className="font-head font-extrabold text-xl mb-4 flex items-center gap-2">
          <TrendingUp className="text-ink" /> الأكثر مبيعاً
        </h2>
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-snow text-slate-500">
              <tr>
                <th className="p-4 text-right">الترتيب</th>
                <th className="p-4 text-right">الكتاب</th>
                <th className="p-4 text-right">نسخ مباعة</th>
                <th className="p-4 text-right">الإيراد</th>
              </tr>
            </thead>
            <tbody>
              {(stats.topSellingBooks || []).map((b, i) => (
                <tr key={b.bookId} className="border-t hover:bg-snow/50">
                  <td className="p-3 text-lg">{medals[i] || `#${i + 1}`}</td>
                  <td className="p-3 font-bold">{b.bookTitle}</td>
                  <td className="p-3 font-semibold">{b.totalSold} نسخة</td>
                  <td className="p-3 font-head font-extrabold text-emerald-600">
                    {Number(b.totalRevenue).toFixed(2)} ج.م
                  </td>
                </tr>
              ))}
              {(stats.topSellingBooks || []).length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400">
                    مفيش مبيعات لسه — أول طلب هيظهر هنا 📈
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: "", phone: "", address: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ bookId: i.book.id, quantity: i.quantity })),
      };
      const res = await api.post("/orders/guest", payload);
      clearCart();
      navigate("/order-success", { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.error || "حصل خطأ أثناء إرسال الطلب، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="text-center py-24 text-slate-500">سلتك فاضية — ضيف كتب الأول 🛒</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-head font-extrabold text-3xl mb-6">إتمام الطلب 📝</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div>
          <label className="block font-bold mb-1">الاسم الكامل *</label>
          <input name="customerName" required value={form.customerName} onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ink"
            placeholder="مثال: أحمد محمد" />
        </div>
        <div>
          <label className="block font-bold mb-1">رقم الموبايل *</label>
          <input name="phone" required pattern="01[0-9]{9}" value={form.phone} onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ink"
            placeholder="01xxxxxxxxx" />
        </div>
        <div>
          <label className="block font-bold mb-1">العنوان بالتفصيل *</label>
          <textarea name="address" required rows={3} value={form.address} onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ink"
            placeholder="المحافظة - المدينة - الشارع - رقم العمارة والشقة" />
        </div>

        <div className="bg-snow rounded-xl p-4 flex justify-between font-head font-extrabold">
          <span>الإجمالي المطلوب</span>
          <span className="text-ink">{totalPrice.toFixed(2)} ج.م</span>
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <button disabled={loading}
          className="w-full bg-ink hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-3">
          {loading ? "جاري إرسال الطلب... ⏳" : "تأكيد الطلب 🎉"}
        </button>
      </form>
    </div>
  );
}
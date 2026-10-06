import { useState } from "react";
import api from "../services/api";
import { Clock, Printer, Package, CheckCircle, Search, Pencil, Trash2, Lock, XCircle } from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "تم الاستلام", icon: Clock },
  { key: "PRINTING", label: "جاري الطباعة", icon: Printer },
  { key: "READY", label: "جاهز ", icon: Package },
  { key: "PICKED_UP", label: "تم التسليم", icon: CheckCircle },
];

const statusBadge = {
  PENDING: "bg-amber-100 text-amber-700",
  PRINTING: "bg-blue-100 text-blue-700",
  READY: "bg-violet-100 text-violet-700",
  PICKED_UP: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusAr = {
  PENDING: "جديد", PRINTING: "جاري الطباعة", READY: "جاهز ",
  PICKED_UP: "تم التسليم", CANCELLED: "ملغي",
};

export default function TrackOrder() {
  const [form, setForm] = useState({ orderCode: ""});
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // 'edit' | 'cancel'
  const [password, setPassword] = useState("");
  const [editForm, setEditForm] = useState({});
  const [actionMsg, setActionMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await api.get(`/orders/status/${form.orderCode}`);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "مش لاقيين طلب بالبيانات دي");
    } finally { setLoading(false); }
  };

  const openEdit = () => {
    setEditForm({ customerName: order.customerName, address: order.address, phone: order.phone || "" , items: order.items
      .map(i => ({ bookId: i.bookId, quantity: i.quantity })) });
    setPassword(""); setActionMsg(""); setModal("edit");
  };

    const handleItemChange = (index, field, value) => {
    const newItems = [...editForm.items];
    newItems[index][field] = value;
    setEditForm({ ...editForm, items: newItems });
  };

  const removeItemFromEdit = (index) => {
    const newItems = editForm.items.filter((_, i) => i !== index);
    setEditForm({ ...editForm, items: newItems });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true); setActionMsg("");
    try {
      const res = await api.put(`/orders/update/${order.orderCode}?pin=${password}`, { ...editForm });
      setOrder(res.data); setModal(null);
    } catch (err) { setActionMsg(err.response?.data?.error || "فشل التعديل"); }
    finally { setActionLoading(false); }
  };

  const submitCancel = async (e) => {
    e.preventDefault();
    setActionLoading(true); setActionMsg("");
    try {
      await api.delete(`/orders/delete/${order.orderCode}?pin=${password}`);
      setOrder({ ...order, status: "CANCELLED" }); setModal(null);
    } catch (err) { setActionMsg(err.response?.data?.error || "فشل الإلغاء"); }
    finally { setActionLoading(false); }
  };

  const currentStep = STEPS.findIndex((s) => s.key === order?.status);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-head font-extrabold text-3xl text-center mb-6">تتبع طلبك 🔍</h1>

      {/* فورم البحث */}
      <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow p-6 flex gap-3 flex-wrap">
        <input required value={form.orderCode} onChange={(e) => setForm({ ...form, orderCode: e.target.value })}
          className="flex-1 min-w-[120px] border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ink"
          placeholder="رقم الطلب" />
        <button className="bg-ink text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2">
          <Search size={18} /> تتبع
        </button>
      </form>

      {loading && <p className="text-center text-slate-500 py-16">جاري البحث... ⏳</p>}
      {error && <p className="text-center text-red-500 font-bold py-16">{error}</p>}

      {/* كارت الطلب */}
      {order && (
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-head font-extrabold text-xl">طلب رقم #{order.orderCode}</h2>
            <span className={`rounded-full px-4 py-1 text-sm font-bold ${statusBadge[order.status]}`}>
              {order.status === "CANCELLED" && <XCircle size={14} className="inline ms-1" />}
              {statusAr[order.status]}
            </span>
          </div>

          {/* الـ Timeline */}
          {order.status === "CANCELLED" ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 font-bold mt-6">
              <XCircle size={40} className="mx-auto mb-2" /> الطلب ده اتلغى
            </div>
          ) : (
            <div className="flex items-start mt-8">
              {STEPS.map((step, i) => {
                const done = i <= currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-start flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${done ? "bg-ink text-white" : "bg-slate-200 text-slate-400"}`}>
                        <Icon size={22} />
                      </div>
                      <span className={`text-xs font-bold text-center ${done ? "text-ink" : "text-slate-400"}`}>{step.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 mt-6 rounded ${i < currentStep ? "bg-ink" : "bg-slate-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* المنتجات */}
          <div className="border-t mt-6 pt-4 space-y-2">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-slate-600">
                <span>{item.bookTitle || item.book?.title} × {item.quantity}</span>
                <span className="font-bold">{(item.quantity * Number(item.price || item.book?.price || 0)).toFixed(2)} ج.م</span>
              </div>
            ))}
            <div className="flex justify-between font-head font-extrabold text-lg pt-2 border-t">
              <span>الإجمالي</span><span className="text-ink">{Number(order.totalPrice ?? 0).toFixed(2)} ج.م</span>
            </div>
          </div>

          {/* أزرار الضيف */}
          {(order.status === "PENDING" ) && (
            <div className="flex gap-3 mt-6">
              {order.status === "PENDING" && (
                <button onClick={openEdit} className="flex-1 border-2 border-ink text-ink font-bold rounded-xl py-3 flex items-center justify-center gap-2">
                  <Pencil size={18} /> تعديل البيانات
                </button>
              )}
              <button onClick={() => { setPassword(""); setActionMsg(""); setModal("cancel"); }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2">
                <Trash2 size={18} /> إلغاء الطلب
              </button>
            </div>
          )}
          <p className="text-xs text-slate-400 text-center mt-3">
            🔒 التعديل والإلغاء محتاجين كلمة سر الطلب اللي دخلتها وقت الطلب
          </p>
        </div>
      )}

      {/* مودال كلمة السر */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={modal === "edit" ? submitEdit : submitCancel}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-head font-extrabold text-xl flex items-center gap-2">
              <Lock size={20} className="text-ink" />
              {modal === "edit" ? "تعديل الطلب" : "إلغاء الطلب"}
            </h3>

            {modal === "edit" && (
              <>
              <input value={editForm.customerName || ""}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3" placeholder="اسم العميل" />
                <input required value={editForm.phone || ""}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3" placeholder="رقم الموبايل" />
                <textarea required rows={2} value={editForm.address || ""}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3" placeholder="العنوان" />
                
                   <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">الكتب المطلوبة</h3>
                <div className="space-y-2">
                  {editForm.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-snow p-2 rounded-xl">
                      <span className="text-xs font-semibold flex-1 truncate">{order.items[index]?.bookTitle}</span>
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        className="w-16 p-1 text-center border rounded-lg text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeItemFromEdit(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              </>
            )}

            {modal === "cancel" && (
              <p className="text-sm text-red-600 font-bold">
                متأكد إنك عايز تلغي الطلب ده؟ القرار ده مش هيتراجع فيه.
              </p>
            )}

            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3" placeholder="🔑 كلمة سر الطلب" />

            {actionMsg && <p className="text-red-500 text-sm font-bold">{actionMsg}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="flex-1 border rounded-xl py-3 font-bold text-slate-600">رجوع</button>
              <button disabled={actionLoading}
                className={`flex-1 text-white rounded-xl py-3 font-bold ${modal === "edit" ? "bg-ink" : "bg-red-500"}`}>
                {actionLoading ? "ثواني... ⏳" : modal === "edit" ? "حفظ التعديل" : "تأكيد الإلغاء"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, ChevronDown, ChevronUp, Edit, Printer, X } from "lucide-react";
import { statusAr, statusBadge } from "../../utils/orderStatus";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  
  // States الخاصة بمودال التعديل
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    items: []
  });

  const fetchOrders = () => api.get("/admin/orders").then((r) => setOrders(r.data));
  useEffect(() => { fetchOrders(); }, []);

  console.log(orders);
  

  const changeStatus = async (orderCode, status) => {
    try {
      await api.put(`/admin/orders/${status}?orderCode=${orderCode}`);
    } catch {
      await api.put(`/admin/orders/status?orderCode=${orderCode}`, { status });
    }
    setOrders((prev) => prev.map((o) => (o.orderCode === orderCode ? { ...o, status } : o)));
  };

  const remove = async (orderCode) => {
    if (!window.confirm("حذف الطلب نهائياً من الداتا بيز؟ مش هيرجع تاني!")) return;
    await api.delete(`/admin/orders/delete/${orderCode}`);
    setOrders((prev) => prev.filter((o) => o.orderCode !== orderCode));
  };

  // فتح مودال التعديل وتعبئة البيانات الحالية للطلب
  const openEditModal = (order) => {
    setEditingOrder(order.orderCode);
    setFormData({
      customerName: order.customerName || "",
      phone: order.phone || "",
      address: order.address || "",
      items: order.items ? order.items.map(i => ({ ...i })) : []
    });
  };

  // تحديث كمية كتاب أو حذفه من القائمة المؤقتة أثناء التعديل
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const removeItemFromEdit = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // حفظ التعديلات وإرسالها للـ API الجديد
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/orders/update/${editingOrder}`, formData);
      setEditingOrder(null);
      fetchOrders(); // إعادة تحميل الطلبات لتحديث الواجهة
    } catch (error) {
      alert("حصل خطأ أثناء التحديث، تأكد من البيانات.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="font-head font-extrabold text-3xl mb-6">الطلبات 📦</h1>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-snow text-slate-500">
            <tr>
              <th className="p-4 text-right"></th>
              <th className="p-4 text-right">الكود</th>
              <th className="p-4 text-right">العميل</th>
              <th className="p-4 text-right">الموبايل</th>
              <th className="p-4 text-right">الإجمالي</th>
              <th className="p-4 text-right">الحالة</th>
              <th className="p-4 text-right">تعديل / حذف</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <>
                <tr key={o.orderCode} className="border-t hover:bg-snow/50">
                  <td className="p-3">
                    <button onClick={() => setExpanded(expanded === o.orderCode ? null : o.orderCode)} className="text-slate-400">
                      {expanded === o.orderCode ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </td>
                  <td className="p-3 font-bold text-ink">{o.orderCode}</td>
                  <td className="p-3 font-semibold">{o.customerName}</td>
                  <td className="p-3" dir="ltr">{o.phone}</td>
                  <td className="p-3 font-head font-extrabold">{Number(o.totalPrice).toFixed(2)} ج.م</td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => changeStatus(o.orderCode, e.target.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold border-0 outline-none cursor-pointer ${statusBadge[o.status]}`}>
                      {Object.keys(statusAr).map((s) => (
                        <option key={s} value={s}>{statusAr[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <button onClick={() => openEditModal(o)} className="bg-blue-100 text-blue-600 rounded-lg p-2 hover:bg-blue-200" title="تعديل الطلب">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => remove(o.orderCode)} className="bg-red-100 text-red-600 rounded-lg p-2 hover:bg-red-200" title="حذف الطلب">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                {expanded === o.orderCode && (
                  <tr key={`${o.orderCode}-details`} className="bg-snow/70">
                    <td colSpan={7} className="p-4">
                      <p className="text-xs text-slate-500 mb-2">📍 {o.address}</p>
                      <div className="space-y-1">
                        {(o.items || []).map((i) => (
                          <div key={i.bookId} className="flex items-center justify-between text-sm font-semibold bg-white p-2 rounded-lg border border-slate-100 mb-1">
                            {/* رابط لفتح/طباعة الكتاب كـ PDF أو صفحة طباعة */}
                            <a 
                              href={i.pdfFileUrl || `#`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                              title="عرض وطباعة الكتاب"
                            >
                              
                              <Printer size={14} />
                              <span>{i.bookTitle}</span>
                            </a>
                            <span>× {i.quantity} = {(i.quantity * Number(i.price)).toFixed(2)} ج.م</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{new Date(o.createdAt).toLocaleString("ar-EG")}</p>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {orders.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-slate-400">مفيش طلبات لسه</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal تعديل الطلب */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-head">تعديل الطلب: {editingOrder}</h2>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">اسم العميل</label>
                <input 
                  type="text" 
                  value={formData.customerName} 
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">رقم الموبايل</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">العنوان</label>
                <textarea 
                  value={formData.address} 
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                  rows="2"
                  required
                />
              </div>

        
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">الكتب المطلوبة</h3>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-snow p-2 rounded-xl">
                      <span className="text-xs font-semibold flex-1 truncate">{item.bookTitle}</span>
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

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-ink text-white rounded-xl text-sm font-bold hover:bg-slate-800"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
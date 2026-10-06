import { useEffect, useState } from "react";
import api from "../../services/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { uploadToR2 } from "../../services/r2";


export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [modal, setModal] = useState(null); // 'add' أو كتاب للتعديل
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [cover, setCover] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [progress, setProgress] = useState({ cover: 0, pdf: 0 });
const [uploading, setUploading] = useState({ cover: false, pdf: false });

  const fetchBooks = () => api.get("/books").then((r) => setBooks(r.data.Books));
  useEffect(() => { fetchBooks(); }, []);
  const openAdd = () => { setForm({ title: "", description: "", price: "" }); setCover(null); setPdf(null); setError(""); setModal("add"); };
  const openEdit = (b) => { setForm({ title: b.title, description: b.description || "", price: b.price }); setCover(null); setPdf(null); setError(""); setModal(b); };




const submit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    let coverImageUrl = null;
    let pdfFileUrl = null;

    // 1. ارفع الصورة لـ R2
    if (cover) {
      setUploading(p => ({ ...p, cover: true }));
      coverImageUrl = await uploadToR2(cover, "cover", (p) =>
        setProgress(prev => ({ ...prev, cover: p }))

      
      );
            console.log(coverImageUrl);

      setUploading(p => ({ ...p, cover: false }));
    } else if (modal === "add") {
      throw new Error("صورة الغلاف مطلوبة");
    }

    // 2. ارفع الـ PDF لـ R2
    if (pdf) {
      setUploading(p => ({ ...p, pdf: true }));
      pdfFileUrl = await uploadToR2(pdf, "pdf", (p) =>
        setProgress(prev => ({ ...prev, pdf: p }))
      );
                  console.log(pdfFileUrl);

      setUploading(p => ({ ...p, pdf: false }));
    } else if (modal === "add") {
      throw new Error("ملف PDF مطلوب");
    }

    // 3. ابعت URLs للـ Backend
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    if (coverImageUrl) fd.append("coverImageUrl", coverImageUrl);
    if (pdfFileUrl) fd.append("pdfFileUrl", pdfFileUrl);

    if (modal === "add") await api.post("/admin/books", fd);
    else await api.put(`/admin/books/${modal.id}`, fd);

    setModal(null);
    fetchBooks();
  } catch (err) {
    setError(err.message || "فشل الحفظ");
    setUploading({ cover: false, pdf: false });
  } finally {
    setLoading(false);
  }
};
  const remove = async (id) => {
    if (!window.confirm("متأكد إنك عايز تحذف الكتاب ده نهائياً؟")) return;
    await api.delete(`/admin/books/delete/${id}`);
    fetchBooks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-head font-extrabold text-3xl">الكتب 📚</h1>
        <button onClick={openAdd} className="bg-ink text-white font-bold rounded-xl px-5 py-3 flex items-center gap-2">
          <Plus size={18} /> إضافة كتاب
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-snow text-slate-500">
            <tr>
              <th className="p-4 text-right">الغلاف</th>
              <th className="p-4 text-right">العنوان</th>
              <th className="p-4 text-right">السعر</th>
              <th className="p-4 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-t hover:bg-snow/50">
                <td className="p-3">
                  {b.coverImageUrl
                    ? <img src={b.coverImageUrl} alt="" className="w-20 h-24 object-cover rounded-lg" />
                    : <span className="text-2xl">📚</span>}
                </td>
                <td className="p-3 font-bold">{b.title}</td>
                <td className="p-3 font-head font-extrabold text-ink">{b.price} ج.م</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(b)} className="bg-blue-100 text-ink rounded-lg p-2 hover:bg-blue-200"><Pencil size={16} /></button>
                    <button onClick={() => remove(b.id)} className="bg-red-100 text-red-600 rounded-lg p-2 hover:bg-red-200"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {books.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-slate-400">مفيش كتب لسه</td></tr>}
          </tbody>
        </table>
      </div>

      {/* مودال إضافة / تعديل */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form onSubmit={submit} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-head font-extrabold text-xl">{modal === "add" ? "إضافة كتاب جديد" : "تعديل الكتاب"}</h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400"><X size={20} /></button>
            </div>
 
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-xl px-4 py-3" placeholder="عنوان الكتاب" />
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-xl px-4 py-3" placeholder="وصف مختصر" />
            <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border rounded-xl px-4 py-3" placeholder="السعر بالجنيه" />

         {/* صورة الغلاف */}
<div>
  <label className="block text-sm font-bold mb-1">صورة الغلاف {modal === "add" && "*"}</label>
  <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])}
    className="w-full text-sm border rounded-xl p-2" />
  {uploading.cover && (
    <div className="mt-2">
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div className="bg-ink h-full rounded-full" style={{ width: `${progress.cover}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-1">رفع الصورة... {progress.cover}%</p>
    </div>
  )}
</div>

{/* الـ PDF */}
<div>
  <label className="block text-sm font-bold mb-1">ملف PDF {modal === "add" && "*"}</label>
  <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])}
    className="w-full text-sm border rounded-xl p-2" />
  {uploading.pdf && (
    <div className="mt-2">
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div className="bg-magenta h-full rounded-full" style={{ width: `${progress.pdf}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-1">رفع الـ PDF... {progress.pdf}%</p>
    </div>
  )}
</div>

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <button disabled={loading} className="w-full bg-ink text-white font-bold rounded-xl py-3">
              {loading ? "جاري الرفع... ⏳" : modal === "add" ? "إضافة الكتاب ✅" : "حفظ التعديل ✅"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
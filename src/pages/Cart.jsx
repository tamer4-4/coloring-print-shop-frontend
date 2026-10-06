import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <ShoppingBag size={64} className="mx-auto text-slate-300" />
        <h2 className="font-head font-bold text-2xl mt-4">سلتك فاضية!</h2>
        <p className="text-slate-500 mt-2">ضيف كتب من الكتالوج الأول</p>
        <Link to="/" className="inline-block bg-ink text-white font-bold rounded-xl px-6 py-3 mt-6">
          تصفح الكتب
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* قائمة المنتجات */}
      <div className="lg:col-span-2 space-y-4">
        {items.map(({ book, quantity }) => (
          <div key={book.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center flex-wrap">
            <img src={book.coverImageUrl} alt={book.title} className="w-20 h-24 object-cover rounded-xl" />
            <div className="flex-1 min-w-[140px]">
              <h3 className="font-bold">{book.title}</h3>
              <p className="text-ink font-head font-extrabold mt-1">{book.price} ج.م</p>
            </div>
            <div className="flex items-center gap-2 bg-snow rounded-xl px-2 py-1">
              <button onClick={() => updateQuantity(book.id, quantity - 1)} className="p-1 hover:text-ink"><Minus size={16} /></button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button onClick={() => updateQuantity(book.id, quantity + 1)} className="p-1 hover:text-ink"><Plus size={16} /></button>
            </div>
            <p className="font-head font-extrabold w-24 text-left">{(quantity * Number(book.price)).toFixed(2)} ج.م</p>
            <button onClick={() => removeFromCart(book.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>

      {/* ملخص الطلب */}
      <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-24">
        <h2 className="font-head font-extrabold text-xl mb-4">ملخص الطلب</h2>
        <div className="flex justify-between text-slate-600 py-2"><span>عدد النسخ</span><span>{totalItems}</span></div>
        <div className="flex justify-between text-slate-600 py-2"><span>التوصيل</span><span className="text-emerald-600 font-bold">مجاني</span></div>
        <div className="border-t my-3"></div>
        <div className="flex justify-between font-head font-extrabold text-lg py-2">
          <span>الإجمالي</span>
          <span className="text-ink">{totalPrice.toFixed(2)} ج.م</span>
        </div>
        <Link to="/checkout" className="block w-full text-center bg-ink hover:bg-blue-700 text-white font-bold rounded-xl py-3 mt-4">
          أكمل الطلب ✅
        </Link>
      </div>
    </div>
  );
}
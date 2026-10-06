import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Plus, Check } from "lucide-react";

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition">
      <div className="aspect-[3/4] w-full bg-slate-100 flex items-center justify-center p-2 overflow-hidden">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-contain" />
        ) : (
          <span className="text-5xl">📚</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold">{book.title}</h3>
        <p className="text-sm text-slate-700 mt-1 line-clamp-2">{book.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-head font-extrabold text-ink text-lg">{book.price} ج.م</span>
          <button
            onClick={handleAdd}
            className={`text-white text-sm font-bold rounded-lg px-3 py-2 flex items-center gap-1 transition ${
              added ? "bg-emerald-500" : "bg-ink hover:bg-blue-700"
            }`}
          >
            {added ? <><Check size={16} /> تمت الإضافة</> : <><Plus size={16} /> السلة</>}
          </button>
        </div>
      </div>
    </div>
  );
}
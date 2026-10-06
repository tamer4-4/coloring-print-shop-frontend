import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex">
            <span className="w-5 h-5 rounded-full bg-cyanx ring-2 ring-white"></span>
            <span className="w-5 h-5 rounded-full bg-magenta ring-2 ring-white -ms-2"></span>
            <span className="w-5 h-5 rounded-full bg-sun ring-2 ring-white -ms-2"></span>
            <span className="w-5 h-5 rounded-full bg-night ring-2 ring-white -ms-2"></span>
          </div>
          <span className="font-head font-extrabold text-2xl">مِداد</span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-ink">الكتب</Link>
          <Link to="/track-order" className="hover:text-ink">تتبع طلبك</Link>
          <Link to="/admin/login" className="hover:text-ink">الأدمن</Link>
        </nav>
          
      <Link to="/cart" className="relative bg-ink text-white rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2">
  <ShoppingCart size={18} /> السلة
  {totalItems > 0 && (
    <span className="absolute -top-2 -left-2 bg-magenta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
      {totalItems}
    </span>
  )}
</Link>
      </div>
    </header>
  );
}
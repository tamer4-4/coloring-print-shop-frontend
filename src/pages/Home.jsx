import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/books")
      .then((res)=>{
      //console.log( res.data);
      setBooks(res.data.Books);

      })
      .catch(() => setError("مش قادرين نوصل للسيرفر حالياً 😅"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center bg-gradient-to-l from-blue-50 via-white to-pink-50 rounded-3xl py-14 px-6">
        <h1 className="font-head font-extrabold text-4xl md:text-5xl">
          ذاكر بالألوان... <span className="text-ink">مش أبيض وأسود</span> 🎨
        </h1>
        <p className="text-slate-600 mt-4 text-lg">
          كتب وملازم مدرسية مطبوعة بأعلى جودة ألوان لطلاب ابتدائي وإعدادي وثانوي
        </p>
        <a href="#books" className="inline-block bg-ink text-white font-bold rounded-xl px-8 py-3 mt-6">
          تصفح الكتب
        </a>
      </section>

      {/* الكتب */}
      <section id="books" className="mt-12">
        <h2 className="font-head font-extrabold text-2xl mb-6">كل الكتب</h2>

        {loading && <p className="text-center text-slate-500 py-20">جاري تحميل الكتب... ⏳</p>}
        {error && <p className="text-center text-red-500 py-20">{error}</p>}
        {!loading && !error && books.length === 0 && (
          <p className="text-center text-slate-500 py-20">مفيش كتب لسه — ضيف أول كتاب من لوحة الأدمن! 📚</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {books.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      </section>
    </div>
  );
}

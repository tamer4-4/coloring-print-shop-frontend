import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-md mx-auto text-center bg-white rounded-3xl shadow p-10 mt-10">
      <CheckCircle size={72} className="mx-auto text-emerald-500" />
      <h1 className="font-head font-extrabold text-3xl mt-4">تم استلام طلبك! 🎉</h1>
      <p className="text-slate-1000 mt-3">احتفظ برقم الطلب عشان تقدر تتابع حالته في أي وقت</p>
   

      <div className="bg-snow rounded-2xl p-4 mt-6">
        <p className="text-sm text-slate-700">رقم الطلب</p>
        <p className="font-head font-extrabold text-3xl text-ink">{order?.orderCode ?? "---"}</p>
      </div>
               
               <p className="text-slate-1000 mt-3">  احتفظ برقم السر لتعديل الطلب او حذفه مش هيظهربك تانى</p>
        <div className="bg-snow rounded-2xl p-4 m-6">
        <p className="text-sm text-slate-700">رقم السر</p>
        <p className="font-head font-extrabold text-3xl text-ink">{order?.pin ?? "---"}</p>

      </div>

      <div className="flex gap-3 mt-6">
        <Link to="/track-order" className="flex-1 bg-ink text-white font-bold rounded-xl py-3">تتبع الطلب</Link>
        <Link to="/"className="flex-1 border-2 border-ink text-ink font-bold rounded-xl py-3">كمل تسوق</Link>
      </div>
    </div>
  );
}
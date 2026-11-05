"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Send, MessageSquareQuote } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, push, onValue, query, limitToLast } from "firebase/database";

type Wish = {
  name: string;
  message: string;
  attendance?: string;
  createdAt: number;
};

export default function RSVP() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ပွဲအသစ်အတွက် path သီးသန့် ခွဲထားပါသည်
    const wishesRef = query(ref(db, "event2_wishes"), limitToLast(40));
    const unsubscribe = onValue(
      wishesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loaded: Wish[] = Object.values(data);
          setWishes(loaded.sort((a, b) => b.createdAt - a.createdAt));
        } else {
          setWishes([]);
        }
      },
      (err) => {
        console.error("Firebase read error:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const attendance = String(formData.get("attendance") ?? "");
    const wish = String(formData.get("wish") ?? "").trim();
    const guests = String(formData.get("guests") ?? "1");
    const phone = String(formData.get("phone") ?? "").trim();

    try {
      await push(ref(db, "event2_rsvps"), {
        name,
        attendance,
        guests,
        phone,
        submittedAt: new Date().toISOString(),
      });

      if (wish) {
        await push(ref(db, "event2_wishes"), {
          name,
          message: wish,
          attendance,
          createdAt: Date.now(),
        });
      }

      form.reset();
      setSubmitted(true);
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.72 },
        colors: ["#D4AF37", "#F5EFEB", "#E6B9B2"],
      });
    } catch (err) {
      console.error("Firebase write error:", err);
      setError("စာရင်းပေးပို့မှု မအောင်မြင်ပါ။ နောက်တစ်ကြိမ် ထပ်မံကြိုးစားပေးပါ။");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="rsvp" className="bg-[#FAF7F2] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-amber-700/80 uppercase">
            RSVP & Best Wishes
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-wide text-stone-800 sm:text-3xl">
            တက်ရောက်မှုနှင့် ဆုမွန်ကောင်းများ
          </h2>
          <div className="mx-auto my-4 h-0.5 w-10 bg-amber-600/30 rounded-full" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              တက်ရောက်မှု အတည်ပြုရန်
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              မင်္ဂလာပွဲ တက်ရောက်မည့် အစီအစဉ်ကို အသိပေး အကြောင်းကြားပေးပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  အမည် *
                </label>
                <input
                  required
                  name="name"
                  placeholder="လူကြီးမင်း၏ အမည် ရိုက်ထည့်ပါ"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-amber-600 focus:bg-white"
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-xs font-semibold text-stone-700">
                  တက်ရောက်မည့် အစီအစဉ် *
                </legend>
                <div className="flex flex-wrap gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 px-4 py-2 text-xs has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50">
                    <input
                      required
                      type="radio"
                      name="attendance"
                      value="တက်ရောက်ပါမည်"
                      className="accent-amber-700"
                    />
                    တက်ရောက်ပါမည်
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 px-4 py-2 text-xs has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50">
                    <input
                      required
                      type="radio"
                      name="attendance"
                      value="မတက်ရောက်နိုင်ပါ"
                      className="accent-amber-700"
                    />
                    မတက်ရောက်နိုင်ပါ
                  </label>
                </div>
              </fieldset>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700">
                    လူဦးရေ
                  </label>
                  <select
                    name="guests"
                    defaultValue="1"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-[#FAF9F5] px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} ဦး
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700">
                    ဖုန်းနံပါတ်
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="09..."
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  မင်္ဂလာမောင်နှံအတွက် ဆုမွန်ကောင်းစကား
                </label>
                <textarea
                  name="wish"
                  rows={3}
                  placeholder="မင်္ဂလာမောင်နှံအတွက် ဆုတောင်းစကား ရေးသားနိုင်ပါသည်..."
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-amber-600 focus:bg-white"
                />
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              {submitted && (
                <p className="text-xs text-amber-700 font-medium">
                  ကျေးဇူးတင်ရှိပါသည်။ စာရင်းနှင့် ဆုတောင်းစကားကို အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 disabled:opacity-50 active:scale-95"
              >
                <Send size={14} />
                <span>{loading ? "ပေးပို့နေပါသည်..." : "RSVP နှင့် ဆုတောင်း ပေးပို့မည်"}</span>
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8 flex flex-col">
            <div className="flex items-center gap-2">
              <MessageSquareQuote size={20} className="text-amber-700" />
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                ဧည့်သည်တော်များ၏ ဆုမွန်ကောင်းများ
              </h3>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              ပေးပို့ထားသော ဆုမွန်ကောင်းများကို အောက်တွင် တိုက်ရိုက် မြင်တွေ့ရပါမည်
            </p>

            <div className="mt-5 space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {wishes.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  <Heart className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                  ပထမဆုံး ဆုမွန်ကောင်းစကားကို ရေးသားပေးပို့လိုက်ပါ။
                </div>
              ) : (
                wishes.map((item, index) => (
                  <motion.div
                    key={`${item.createdAt}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border-l-4 border-amber-600 bg-[#FAF9F5] p-4 text-left"
                  >
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed italic">
                      “{item.message}”
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-amber-800 font-medium">
                      <span>— {item.name}</span>
                      {item.attendance && (
                        <span className="text-[10px] text-stone-400 font-normal">
                          ({item.attendance})
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
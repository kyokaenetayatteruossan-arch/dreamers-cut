"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "ログインに失敗しました。");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError("Googleログインに失敗しました。");
    }
  };

  return (
    <ClientOnly>
      <main className="min-h-screen flex items-center justify-center pt-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary opacity-20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-accent opacity-20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="max-w-md w-full relative z-10">
          <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-12 rounded-[40px] shadow-2xl animate-in">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-grad-sunset rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30 float-animation">
                <Sparkles size={36} />
              </div>
              <h1 className="text-3xl font-extrabold mb-2 text-white">おかえりなさい</h1>
              <p className="text-white/50 text-sm pb-4">夢を叶える鍵を、もう一度。</p>
            </div>

            {error && (
              <div className="bg-error/20 border border-error/50 text-error text-xs p-4 rounded-xl mb-6 text-center font-bold">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-white/80">メールアドレス</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all text-white backdrop-blur-sm"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-white/80">パスワード</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all text-white backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !email || !password}
                className={`btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-2 group text-lg mt-8 active:scale-95 shadow-xl shadow-primary/20 ${loading ? "opacity-70 cursor-not-allowed" : "glow-effect"}`}
              >
                {loading ? "ログイン中..." : "ログイン"}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="relative group">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-3 transition-all opacity-50 cursor-help"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 filter grayscale" />
                Googleでログイン (準備中)
              </button>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-2xl z-20">
                現在設定中のため、メールログインをご利用ください
              </div>
            </div>

            <div className="mt-10 text-center text-sm border-t border-white/10 pt-8">
              <span className="text-white/50">まだアカウントをお持ちでないですか？ </span>
              <Link href="/register" className="text-primary font-bold hover:underline">新規登録</Link>
            </div>
          </form>
        </div>
      </main>
    </ClientOnly>
  );
}

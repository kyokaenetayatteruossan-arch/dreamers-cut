"use client";

import { useState, useEffect } from "react";
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
  const { user, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  // ログイン状態を監視して、ユーザー情報が取得できたらダッシュボードへ
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      // 遷移は useEffect(user監視) に任せる
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
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary opacity-5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-accent opacity-5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-12 rounded-[40px] shadow-xl animate-in border border-black/5">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-grad-sunset rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
                <Sparkles size={36} />
              </div>
              <h1 className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">おかえりなさい</h1>
              <p className="text-foreground/40 text-sm font-bold pb-4">夢を叶える鍵を、もう一度。</p>
            </div>

            {error && (
              <div className="bg-error/5 border border-error/20 text-error text-xs p-4 rounded-2xl mb-6 text-center font-black">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black ml-1 text-foreground/60">メールアドレス</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-foreground/10"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black ml-1 text-foreground/60">パスワード</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-foreground/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !email || !password}
                className={`btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-2 group text-lg mt-8 active:scale-95 shadow-lg shadow-primary/20 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "ログイン中..." : "ログイン"}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-black/5" />
              <span className="text-[10px] text-foreground/20 font-black uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-black/5" />
            </div>

            <div className="relative group">
              <button 
                type="button"
                className="w-full bg-black/[0.02] border border-black/5 text-foreground/30 font-black py-4 rounded-2xl mt-8 flex items-center justify-center gap-3 transition-all cursor-help"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 filter grayscale opacity-30" />
                Googleでログイン (準備中)
              </button>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20 font-bold">
                現在設定中のため、メールログインをご利用ください
              </div>
            </div>

            <div className="mt-10 text-center text-sm border-t border-black/5 pt-8">
              <span className="text-foreground/40 font-bold">まだアカウントをお持ちでないですか？ </span>
              <Link href="/register" className="text-secondary font-black hover:underline">新規登録</Link>
            </div>
          </form>
        </div>
      </main>
    </ClientOnly>
  );
}

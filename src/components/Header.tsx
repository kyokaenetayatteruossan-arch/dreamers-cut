"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Star, Trophy, LogOut, User as UserIcon, AlertCircle, Menu, X, ArrowRight } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMenuOpen(false);
  };

  const getRankColor = (likes: number) => {
    if (likes >= 500) return "text-yellow-400"; // Gold Crown
    if (likes >= 100) return "text-slate-300"; // Silver Crown
    return "text-secondary"; // Default star
  };

  return (
    <>
      <nav className="glass fixed top-0 w-full z-50 py-3 px-4 sm:px-6 flex justify-between items-center border-b border-white/5 transition-all">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-grad-sunset flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles size={22} className="group-hover:animate-pulse" />
          </div>
          <span className="font-black text-xl tracking-tight text-white hidden sm:block delay-100 animate-in">
            Dreamer&apos;s Cut
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden xs:flex items-center gap-4 sm:gap-6">
          <ClientOnly>
            {user ? (
              <>
                <Link href="/market" className="text-sm font-bold text-white/80 hover:text-white transition-colors">お仕事を探す</Link>
                <Link href="/request/new" className="text-sm font-bold text-white/80 hover:text-white transition-colors">依頼する</Link>
                
                {/* Stats Badge */}
                <div className="flex items-center gap-4 px-5 py-2 rounded-full glass-card border border-white/10 text-xs font-bold shadow-inner">
                  <div className={`flex items-center gap-1 ${getRankColor(user.likes || 0)}`}>
                    {(user.likes || 0) >= 100 ? <Trophy size={16} fill="currentColor" /> : <Star size={16} fill="currentColor" />}
                    <span>{user.likes || 0}</span>
                  </div>

                  {(user.penaltyPoints || 0) > 0 && (
                    <div className="flex items-center gap-1 text-error animate-pulse">
                      <AlertCircle size={14} />
                      <span>x{user.penaltyPoints}</span>
                    </div>
                  )}
                </div>

                <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity pl-2 border-l border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white border border-white/20 shadow-md">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon size={20} />
                    )}
                  </div>
                  <span className="font-bold text-sm text-white">{user.name}</span>
                </Link>

                <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link href="/market" className="text-sm font-bold text-white/80 hover:text-white transition-colors">お仕事を探す</Link>
                <Link href="/login" className="text-sm font-bold text-white/80 hover:text-white transition-colors">ログイン</Link>
                <Link href="/register" className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
                  新規登録 <ArrowRight size={14} />
                </Link>
              </>
            )}
          </ClientOnly>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="xs:hidden p-2 text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl xs:hidden pt-24 px-6 flex flex-col gap-6 animate-in">
          <ClientOnly>
            {user ? (
              <>
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white border border-white/20 shadow-md">
                    {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : <UserIcon size={28} />}
                  </div>
                  <div>
                    <div className="font-extrabold text-xl text-white">{user.name}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm font-bold">
                       <div className={`flex items-center gap-1 ${getRankColor(user.likes || 0)}`}>
                         {(user.likes || 0) >= 100 ? <Trophy size={14} fill="currentColor" /> : <Star size={14} fill="currentColor" />}
                         <span>{user.likes || 0} ポイント</span>
                       </div>
                       {(user.penaltyPoints || 0) > 0 && (
                          <div className="flex items-center gap-1 text-error">
                             <AlertCircle size={14} />
                             <span>x{user.penaltyPoints}</span>
                          </div>
                       )}
                    </div>
                  </div>
                </div>
                
                <Link href="/dashboard" className="text-xl font-bold py-3 text-white" onClick={() => setIsMenuOpen(false)}>マイページ</Link>
                <Link href="/market" className="text-xl font-bold py-3 text-white" onClick={() => setIsMenuOpen(false)}>お仕事を探す</Link>
                <Link href="/request/new" className="text-xl font-bold py-3 text-white" onClick={() => setIsMenuOpen(false)}>新しく依頼する</Link>
                
                <button onClick={handleLogout} className="flex items-center gap-3 text-xl font-bold py-3 text-error mt-auto mb-12">
                  <LogOut size={24} /> ログアウト
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/market" className="text-xl font-bold py-3 text-center text-white border border-white/10 rounded-xl" onClick={() => setIsMenuOpen(false)}>お仕事を探す</Link>
                <Link href="/login" className="text-xl font-bold py-3 text-center text-white border border-white/10 rounded-xl" onClick={() => setIsMenuOpen(false)}>ログイン</Link>
                <Link href="/register" className="btn-primary text-xl font-bold py-4 text-center mt-4" onClick={() => setIsMenuOpen(false)}>新規登録（無料）</Link>
              </div>
            )}
          </ClientOnly>
        </div>
      )}
    </>
  );
}

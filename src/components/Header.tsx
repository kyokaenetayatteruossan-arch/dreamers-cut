"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/context/JobContext";
import { Sparkles, Star, Trophy, LogOut, User as UserIcon, AlertCircle, Menu, X, ArrowRight, Bell } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const { jobs } = useJobs();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(15, 20, 35, 0)", "rgba(15, 20, 35, 0.7)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(24px)"]
  );

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", updateScrolled);
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

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
      <motion.nav 
        style={{ 
          backgroundColor: headerBackground, 
          borderColor: headerBorder,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur
        }}
        className="fixed top-0 w-full z-50 py-3 px-4 sm:px-6 flex justify-between items-center border-b transition-all duration-300"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-grad-sunset flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles size={22} className="group-hover:animate-pulse" />
          </div>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-black text-xl tracking-tight text-white hidden sm:block"
          >
            Dreamer&apos;s Cut
          </motion.span>
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

                {/* Notifications Bell */}
                <div className="relative group">
                   <button 
                     onClick={() => router.push('/dashboard')}
                     className="p-2.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all border border-transparent hover:border-white/10"
                   >
                     <Bell size={20} />
                     {/* 自分の依頼が進行中になった、などの通知ドット */}
                     {(jobs.filter(j => (j.requestorId === user.id && j.status === 'ongoing') || (j.providerId === user.id && j.status === 'delivered')).length > 0) && (
                       <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary border border-background"></span>
                       </span>
                     )}
                   </button>
                   <div className="absolute top-full right-0 mt-2 w-48 py-3 px-4 glass-card border border-white/10 rounded-2xl text-[10px] font-bold text-white/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl pointer-events-none z-50">
                      進行中または更新された案件があります
                   </div>
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

                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-3 py-2 text-error hover:bg-error/10 rounded-xl transition-all font-bold text-sm"
                  title="ログアウト"
                >
                  <LogOut size={18} />
                  <span>ログアウト</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/market" className="text-sm font-bold text-white/80 hover:text-white transition-colors">お仕事を探す</Link>
                <Link href="/login" className="text-sm font-bold text-white/80 hover:text-white transition-colors">ログイン</Link>
                <Link 
                  href="/register" 
                  className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center gap-2 glow-effect transition-all active:scale-95"
                >
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
      </motion.nav>

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
                
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center gap-3 text-xl font-bold py-5 text-white bg-error/20 border border-error/50 rounded-2xl mt-auto mb-12 shadow-lg active:scale-95 transition-all shadow-error/10"
                >
                  <LogOut size={24} /> ログアウトする
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

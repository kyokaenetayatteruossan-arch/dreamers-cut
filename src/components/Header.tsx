"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/context/JobContext";
import { useNotifications } from "@/context/NotificationContext";
import { Sparkles, Star, Trophy, LogOut, User as UserIcon, AlertCircle, Menu, X, ArrowRight, Bell } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const { jobs } = useJobs();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.05)"]
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(20px)"]
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
    if (likes >= 500) return "text-yellow-600"; // Adjusted for light bg
    if (likes >= 100) return "text-slate-500"; 
    return "text-secondary"; 
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
            className="font-black text-xl tracking-tight text-foreground hidden sm:block"
          >
            Dreamer&apos;s Cut
          </motion.span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden xs:flex items-center gap-4 sm:gap-6">
          <ClientOnly>
            {user ? (
              <>
                <Link href="/market" className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors">お仕事を探す</Link>
                <Link href="/request/new" className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors">依頼する</Link>
                
                {/* Stats Badge */}
                <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-black/5 border border-black/5 text-xs font-bold">
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
                <div className="relative">
                   <button 
                     onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                     className={`p-2.5 rounded-xl transition-all border ${isNotificationsOpen ? 'bg-black/5 border-black/10 text-primary' : 'hover:bg-black/5 text-foreground/40 hover:text-foreground border-transparent'}`}
                   >
                     <Bell size={20} />
                     {unreadCount > 0 && (
                       <span className="absolute top-2 right-2 flex h-4 w-4">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                         <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-primary text-[8px] text-white border border-white">
                           {unreadCount > 9 ? '9+' : unreadCount}
                         </span>
                       </span>
                     )}
                   </button>
                   
                   <AnimatePresence>
                     {isNotificationsOpen && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="fixed xs:absolute top-[70px] xs:top-full right-4 xs:right-0 mt-2 xs:mt-4 w-[calc(100vw-32px)] xs:w-[360px] glass-card border border-black/10 rounded-[2rem] shadow-2xl z-[100] overflow-hidden bg-white"
                       >
                         <div className="p-5 border-b border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-xl">
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/30">通知センター</h3>
                           </div>
                           <button 
                            onClick={() => markAllAsRead()}
                            className="text-[10px] font-black text-primary hover:text-primary-dark transition-colors"
                           >
                             すべて既読にする
                           </button>
                         </div>
                         
                         <div className="max-h-[min(450px,70vh)] overflow-y-auto custom-scrollbar bg-white">
                           {notifications.length > 0 ? (
                             notifications.map((n) => (
                               <button 
                                 key={n.id}
                                 onClick={() => {
                                   markAsRead(n.id);
                                   if (n.link) router.push(n.link);
                                   setIsNotificationsOpen(false);
                                 }}
                                 className={`w-full p-5 flex gap-4 text-left hover:bg-black/[0.02] transition-all border-b border-black/5 last:border-0 relative group ${!n.is_read ? 'bg-primary/5' : ''}`}
                               >
                                 <div className={`mt-1 w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-active:scale-90 ${
                                   n.type === 'new_message' ? 'bg-blue-500/10 text-blue-600' :
                                   n.type === 'job_accepted' ? 'bg-emerald-500/10 text-emerald-600' :
                                   'bg-primary/10 text-primary'
                                 }`}>
                                   {n.type === 'new_message' ? <Sparkles size={22} /> : <Bell size={22} />}
                                 </div>
                                 <div className="flex-1 space-y-1">
                                   <div className={`text-xs font-black flex items-center gap-2 ${!n.is_read ? 'text-foreground' : 'text-foreground/30'}`}>
                                      {n.type === 'new_message' && <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-[8px] text-blue-600 uppercase tracking-tighter">MESSAGE</span>}
                                      {n.title}
                                   </div>
                                   <div className={`text-[11px] leading-relaxed ${!n.is_read ? 'text-foreground/70' : 'text-foreground/30'}`}>{n.content}</div>
                                   <div className="text-[9px] text-foreground/20 font-bold">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                 </div>
                                 {!n.is_read && <div className="absolute top-1/2 right-4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary" />}
                               </button>
                             ))
                           ) : (
                             <div className="p-16 text-center space-y-4">
                               <div className="w-16 h-16 rounded-3xl bg-black/[0.03] mx-auto flex items-center justify-center">
                                 <Bell size={32} className="text-black/5" />
                               </div>
                               <p className="text-xs text-black/20 font-bold tracking-tight">新しい通知はありません</p>
                             </div>
                           )}
                         </div>
                         
                         <div className="p-4 bg-black/[0.02] text-center border-t border-black/5">
                            <Link 
                              href="/dashboard" 
                              onClick={() => setIsNotificationsOpen(false)}
                              className="text-[10px] font-black text-foreground/20 hover:text-primary transition-colors tracking-widest uppercase"
                            >
                              View all history
                            </Link>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>

                <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity pl-2 border-l border-black/10">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-foreground/40 border border-black/5 shadow-sm">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon size={20} />
                    )}
                  </div>
                  <span className="font-bold text-sm text-foreground">{user.name}</span>
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-3 py-2 text-error hover:bg-error/5 rounded-xl transition-all font-bold text-sm"
                  title="ログアウト"
                >
                  <LogOut size={18} />
                  <span>ログアウト</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/market" className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors">お仕事を探す</Link>
                <Link href="/login" className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors">ログイン</Link>
                <Link 
                  href="/register" 
                  className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  新規登録 <ArrowRight size={14} />
                </Link>
              </>
            )}
          </ClientOnly>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="xs:hidden p-2 text-foreground" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl xs:hidden pt-24 px-6 flex flex-col gap-6 animate-in">
          <ClientOnly>
            {user ? (
              <>
                <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                  <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center text-foreground/40 border border-black/5 shadow-md">
                    {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : <UserIcon size={28} />}
                  </div>
                  <div>
                    <div className="font-extrabold text-xl text-foreground">{user.name}</div>
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
                
                <Link href="/dashboard" className="text-xl font-bold py-3 text-foreground" onClick={() => setIsMenuOpen(false)}>マイページ</Link>
                <Link href="/market" className="text-xl font-bold py-3 text-foreground" onClick={() => setIsMenuOpen(false)}>お仕事を探す</Link>
                <Link href="/request/new" className="text-xl font-bold py-3 text-foreground" onClick={() => setIsMenuOpen(false)}>新しく依頼する</Link>
                
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center gap-3 text-xl font-bold py-5 text-white bg-error shadow-lg rounded-2xl mt-auto mb-12 active:scale-95 transition-all shadow-error/20"
                >
                  <LogOut size={24} /> ログアウトする
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/market" className="text-xl font-bold py-3 text-center text-foreground border border-black/5 rounded-xl" onClick={() => setIsMenuOpen(false)}>お仕事を探す</Link>
                <Link href="/login" className="text-xl font-bold py-3 text-center text-foreground border border-black/5 rounded-xl" onClick={() => setIsMenuOpen(false)}>ログイン</Link>
                <Link href="/register" className="btn-primary text-xl font-bold py-4 text-center mt-4" onClick={() => setIsMenuOpen(false)}>新規登録（無料）</Link>
              </div>
            )}
          </ClientOnly>
        </div>
      )}
    </>
  );
}

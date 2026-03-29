"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useJobs } from "@/context/JobContext";
import { 
  Trophy, Star, AlertCircle, Play, 
  PlusCircle, Award, ShieldCheck,
  ChevronRight, Gift, Sparkles as SparklesIcon, ArrowRight,
  ClipboardList, MessageSquare, Clock, History as HistoryIcon, Loader2, Info
} from "lucide-react";
import ClientOnly from "@/components/ClientOnly";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const { jobs, loading: jobsLoading, updateJobStatus, deleteJob, clearAllTestData } = useJobs();
  const router = useRouter();
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleCancelJob = async (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("この依頼を取り下げますか？（この操作は取り消せません）")) {
      return;
    }

    try {
      await updateJobStatus(jobId, "cancelled");
    } catch (err) {
      console.error("Cancel Error:", err);
      alert("取り下げに失敗しました。時間をおいて再度お試しください。");
    }
  };

  const handleDeleteJob = async (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("この案件をシステムから完全に削除しますか？\n履歴も一切残りません。")) {
      return;
    }

    try {
      await deleteJob(jobId);
    } catch (err) {
      console.error("Delete Error:", err);
      alert("削除に失敗しました。");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("【警告】すべてのテスト用案件とチャット履歴を完全に消去しますか？\nこの操作は元に戻せません。")) {
      return;
    }

    setIsCleaning(true);
    try {
      await clearAllTestData();
      alert("すべてのテストデータを消去しました。");
    } catch (err) {
      console.error("Clear All Error:", err);
      alert("エラーが発生しました。一部のデータが残っている可能性があります。");
    } finally {
      setIsCleaning(false);
    }
  };

  const loading = authLoading || jobsLoading;

  // 1. 自分が引き受けた仕事 (進行中 or 納品済み)
  const myWork = jobs
    .filter(j => j.providerId === user?.id && j.status !== 'cancelled' && j.status !== 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // 2. 自分が投稿した現在の依頼
  const myRequests = jobs
    .filter(j => j.requestorId === user?.id && j.status !== 'cancelled' && j.status !== 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 3. 過去の履歴（完了済み）
  const history = jobs
    .filter(j => (j.requestorId === user?.id || j.providerId === user?.id) && j.status === 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-black/5 text-foreground/40 border-black/5";
      case "ongoing": return "bg-secondary/10 text-secondary border-secondary/20";
      case "delivered": return "bg-success/10 text-success border-success/20";
      case "completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-black/[0.03] text-foreground/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "募集中";
      case "ongoing": return "進行中";
      case "delivered": return "納品完了";
      case "completed": return "完了";
      case "cancelled": return "キャンセル";
      default: return status;
    }
  };

  const handleDraw = async () => {
    if (!user || user.points < 10) return;
    setIsDrawing(true);
    setLastResult(null);

    setTimeout(async () => {
       const prizes = ["Amazonギフト券 500円分", "公式ステッカー", "次回手数料無料クーポン", "ハズレ..."];
       const result = prizes[Math.floor(Math.random() * prizes.length)];
       setLastResult(result);
       setIsDrawing(false);
       
       // データベースのポイントを更新
       await updateUser({ points: user.points - 10 });
    }, 2000);
  };

  return (
    <ClientOnly>
      {loading ? (
        <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-primary/10 relative z-10"></div>
          <div className="text-xl font-bold text-primary mb-4 animate-pulse relative z-10">データを読み込み中...</div>
        </main>
      ) : !user ? (
        <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-error opacity-5 blur-[150px] rounded-full pointer-events-none" />
          <div className="text-xl font-bold text-foreground mb-6 relative z-10">セッションが切れました。再度ログインしてください。</div>
          <button onClick={() => router.push("/login")} className="btn-primary px-8 py-3 shadow-xl relative z-10">
             ログイン画面へ
          </button>
        </main>
      ) : (
        <main className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/[0.03] blur-[150px] rounded-full pointer-events-none" />
          
          <div className="section-container relative z-10">
            
            {/* User Stats Card */}
            <div className="glass-card p-6 sm:p-10 rounded-[32px] mb-12 relative overflow-hidden animate-in">
              <div className="absolute top-0 right-0 w-80 h-80 bg-grad-sunset opacity-[0.05] blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 hidden sm:block pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black/[0.03] border border-black/5 flex items-center justify-center text-foreground/20 text-4xl sm:text-5xl font-black shadow-inner float-animation overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  {user.crown !== "none" && (
                    <div className={`absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform rotate-12 ${
                      user.crown === "gold" ? "bg-gradient-to-br from-yellow-100 to-yellow-500 text-yellow-700 border-2 border-yellow-200" : "bg-gradient-to-br from-slate-100 to-slate-400 text-slate-600 border-2 border-slate-200"
                    }`}>
                      <Trophy size={20} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{user.name} <span className="text-xl font-medium text-foreground/30">様</span></h1>
                    <div className="flex justify-center md:justify-start items-center gap-2 sm:gap-3">
                       <div className="flex items-center gap-1 bg-black/[0.03] text-primary px-4 py-1.5 rounded-full text-sm font-bold border border-black/5">
                          <Star size={16} fill="currentColor" />
                          <span>{user.likes} いいね</span>
                       </div>
                       {user.penaltyPoints > 0 && (
                         <div className="flex items-center gap-1 bg-error/10 text-error px-4 py-1.5 rounded-full text-sm font-bold border border-error/10 animate-pulse">
                            <AlertCircle size={16} />
                            <span>ペナルティ x{user.penaltyPoints}</span>
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-black/[0.03] rounded-2xl border border-black/5 shadow-inner">
                       <div className="text-[10px] sm:text-xs text-foreground/30 mb-1 font-bold tracking-wider">実績件数</div>
                       <div className="text-xl sm:text-2xl font-black text-foreground">{user.achievements} <span className="text-xs font-medium text-foreground/20">件</span></div>
                    </div>
                    <div className="p-4 bg-primary/[0.03] rounded-2xl border border-primary/10 shadow-inner relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-10"><Star className="text-primary"/></div>
                       <div className="text-[10px] sm:text-xs text-primary/70 mb-1 font-bold tracking-wider relative z-10">獲得ポイント</div>
                       <div className="text-xl sm:text-2xl font-black text-foreground relative z-10">{user.points} <span className="text-xs font-medium text-foreground/20">pt</span></div>
                    </div>
                    <div className="p-4 bg-black/[0.03] rounded-2xl border border-black/5 shadow-inner">
                       <div className="text-[10px] sm:text-xs text-foreground/30 mb-1 font-bold tracking-wider">現在のランク</div>
                       <div className="text-sm sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-800 line-clamp-1">
                         {user.likes >= 500 ? "Gold Dreamer" : user.likes >= 100 ? "Silver Dreamer" : "Newbie"}
                       </div>
                    </div>
                    <div className="p-4 bg-black/[0.03] rounded-2xl border border-black/5 shadow-inner">
                       <div className="text-[10px] sm:text-xs text-foreground/30 mb-1 font-bold tracking-wider">アカウント状態</div>
                       <div className="text-xs sm:text-sm font-bold flex items-center gap-1 text-success">
                         <ShieldCheck size={16} />
                         認証済
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Work & My Requests Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              
              {/* My Work (As a Provider) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <Award size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">受託した仕事</h2>
                  </div>
                  <span className="text-xs font-bold text-foreground/20 uppercase tracking-widest">{myWork.length} 件</span>
                </div>

                <div className="space-y-4">
                  {myWork.length > 0 ? (
                    myWork.map((job) => (
                      <Link 
                        key={job.id}
                        href={`/project/${job.id}`}
                        className="block glass-card p-5 rounded-3xl hover:bg-black/[0.02] transition-all border border-black/5 group relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${getStatusColor(job.status)} uppercase tracking-wider`}>
                            {getStatusLabel(job.status)}
                          </span>
                          <span className="text-xs font-bold text-foreground/30 tracking-tight">¥{job.reward.toLocaleString()}</span>
                        </div>
                        <h4 className="font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">{job.title}</h4>
                        <div className="flex items-center justify-between text-[10px] font-bold text-foreground/20">
                          <div className="flex items-center gap-2">
                             <Clock size={12} />
                             <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-secondary group-hover:translate-x-1 transition-transform">
                             ROOMへ入る <ChevronRight size={14} />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-12 text-center rounded-3xl border border-dashed border-black/10 bg-black/[0.02]">
                       <ClipboardList className="mx-auto mb-4 text-black/5" size={40} />
                       <p className="text-sm font-bold text-foreground/20">現在、受託中の仕事はありません</p>
                       <Link href="/market" className="text-xs font-black text-secondary hover:underline mt-4 inline-block">マーケットで探す →</Link>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* My Requests (As a Requestor) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <PlusCircle size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">自分の依頼</h2>
                  </div>
                  <span className="text-xs font-bold text-foreground/20 uppercase tracking-widest">{myRequests.length} 件</span>
                </div>

                <div className="space-y-4">
                  {myRequests.length > 0 ? (
                    myRequests.map((job) => (
                      <Link 
                        key={job.id}
                        href={job.status === 'pending' ? '#' : `/project/${job.id}`}
                        className={`block glass-card p-5 rounded-3xl transition-all border border-black/5 group relative overflow-hidden ${job.status === 'pending' ? 'cursor-default' : 'hover:bg-black/[0.02]'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${getStatusColor(job.status)} uppercase tracking-wider`}>
                            {getStatusLabel(job.status)}
                          </span>
                          <div className="flex items-center gap-2">
                            {job.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => handleCancelJob(e, job.id)}
                                  className="text-[10px] font-black text-foreground/20 hover:text-foreground transition-colors"
                                >
                                  取り下げ
                                </button>
                                <span className="text-foreground/5 text-[10px]">|</span>
                                <button 
                                  onClick={(e) => handleDeleteJob(e, job.id)}
                                  className="text-[10px] font-black text-error/40 hover:text-error transition-colors"
                                >
                                  完全に削除
                                </button>
                              </div>
                            )}
                            <span className="text-xs font-bold text-foreground/30 tracking-tight">¥{job.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <h4 className="font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">{job.title}</h4>
                        <div className="flex items-center justify-between text-[10px] font-bold text-foreground/20">
                          <div className="flex items-center gap-2">
                             <Clock size={12} />
                             <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                          {job.status !== 'pending' ? (
                            <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                               ROOMへ入る <ChevronRight size={14} />
                            </div>
                          ) : (
                            <span className="text-[9px] text-foreground/10 italic font-medium">担当者の決定を待っています</span>
                          )}
                        </div>
                        {job.status === 'ongoing' && (
                          <div className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </div>
                        )}
                      </Link>
                    ))
                  ) : (
                    <div className="py-12 text-center rounded-3xl border border-dashed border-black/10 bg-black/[0.02]">
                       <MessageSquare className="mx-auto mb-4 text-black/5" size={40} />
                       <p className="text-sm font-bold text-foreground/20">依頼した案件はまだありません</p>
                       <Link href="/request/new" className="text-xs font-black text-primary hover:underline mt-4 inline-block">新しく依頼する →</Link>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* History Section (Completed) */}
              {history.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 mt-12 mb-8"
                >
                  <div className="flex items-center justify-between px-2 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-foreground/30">
                        <HistoryIcon size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-foreground/30 tracking-tight">完了済みの履歴</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.map((job) => (
                      <Link 
                        key={job.id}
                        href={`/project/${job.id}`}
                        className="block glass-card p-4 rounded-2xl opacity-60 hover:opacity-100 transition-all border border-black/5 group"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20 text-primary uppercase">完了</span>
                            <h4 className="font-bold text-foreground text-sm line-clamp-1">{job.title}</h4>
                          </div>
                          <span className="text-xs font-bold text-foreground/10">¥{job.price.toLocaleString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <PlusCircle className="text-primary" size={24} />
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">動画を依頼する</h2>
                </div>
                <Link 
                  href="/request/new" 
                  className="block p-8 rounded-3xl bg-grad-sunset shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform group relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <h3 className="text-2xl font-black mb-2 relative z-10 text-white leading-tight">新しい依頼を作成</h3>
                   <p className="text-white/80 text-sm mb-8 relative z-10 leading-relaxed max-w-[90%] font-medium">大切な思い出を、1分2000円から編集依頼。詳細な要望もこちらから手軽に入力できます。</p>
                   <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors relative z-10 shadow-inner">
                      <ChevronRight size={28} className="text-white" />
                   </div>
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <Award className="text-secondary" size={24} />
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">仕事を受ける</h2>
                </div>

                {!user.hasPassedTraining ? (
                  <div className="p-8 rounded-3xl border border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent relative overflow-hidden group backdrop-blur-md text-center">
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner">
                        <Play size={32} className="text-secondary ml-1" fill="currentColor" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground">まず学習を始めましょう</h3>
                      <p className="text-foreground/50 text-sm mb-8 leading-relaxed max-w-sm mx-auto font-medium">
                        動画編集の基礎と当サービスのルールを30分で学びます。テスト合格後に正式なクリエイターとして仕事を受けられます。
                      </p>
                      <Link 
                        href="/learning" 
                        className="glass px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-md hover:bg-black/5 transition-colors text-foreground font-bold"
                      >
                        学習動画を見る
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/market" 
                    className="block p-8 rounded-3xl bg-black/[0.02] border border-black/5 backdrop-blur-md shadow-lg hover:bg-black/[0.04] hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Star size={150} />
                    </div>
                    <h3 className="text-2xl font-black mb-2 relative z-10 text-foreground">案件を探す <span className="text-lg font-bold text-secondary ml-2">Market</span></h3>
                    <p className="text-foreground/50 text-sm mb-8 relative z-10 leading-relaxed max-w-[90%] font-medium">現在募集中の依頼を確認して、編集の仕事を始めましょう。初心者歓迎の案件も多数あります。</p>
                    <div className="bg-black/5 border border-black/5 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-black/10 transition-colors relative z-10">
                       <ChevronRight size={28} className="text-foreground/40" />
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Gacha Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <Gift className="text-primary" size={24} />
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">お楽しみくじ</h2>
                </div>
                
                <div className="p-8 md:p-12 rounded-[32px] glass-card relative overflow-hidden">
                   <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary opacity-[0.05] blur-[80px] rounded-full pointer-events-none" />
                   
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
                       <div>
                        <h3 className="text-2xl font-black mb-2 text-foreground flex items-center gap-2">
                          <SparklesIcon className="text-yellow-600" />
                          ドリーム・ガチャ
                        </h3>
                        <p className="text-sm text-foreground/50 font-medium">1回 <span className="text-primary font-bold">10 pt</span> で豪華景品に挑戦！</p>
                      </div>
                      <div className="bg-black/[0.03] backdrop-blur-md px-6 py-3 rounded-2xl border border-black/5 flex items-center gap-4 w-full sm:w-auto">
                        <div className="text-xs font-bold text-foreground/20 tracking-wider">所持ポイント</div>
                        <div className="text-2xl font-black text-foreground">{user.points} <span className="text-sm font-medium text-foreground/20">pt</span></div>
                      </div>
                   </div>

                   <div className="bg-black/[0.05] p-8 sm:p-12 rounded-3xl border border-black/5 text-center relative overflow-hidden shadow-inner backdrop-blur-sm">
                      {isDrawing ? (
                        <div className="animate-pulse py-8">
                           <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-inner border border-primary/20">
                             <Gift size={48} className="text-primary" />
                           </div>
                           <div className="font-black italic tracking-widest text-primary text-xl">DRAWING...</div>
                        </div>
                      ) : lastResult ? (
                        <div className="animate-in zoom-in duration-500 py-8">
                           <SparklesIcon size={56} className="mx-auto text-yellow-600 mb-6 float-animation" />
                           <div className="text-sm font-bold text-primary mb-2 bg-primary/10 inline-block px-4 py-1.5 rounded-full border border-primary/20">結果発表！</div>
                           <div className="text-2xl sm:text-4xl font-black text-foreground my-6 tracking-tight">{lastResult}</div>
                           <button onClick={() => setLastResult(null)} className="text-sm font-bold text-foreground/40 hover:text-foreground transition-colors flex items-center gap-2 mx-auto">
                             <Play size={16} /> もう一度引く
                           </button>
                        </div>
                      ) : (
                        <div className="relative z-10 py-8">
                           <Gift size={64} className="mx-auto text-black/5 mb-8 float-animation" />
                           <button 
                             onClick={handleDraw}
                             disabled={user.points < 10}
                             className={`btn-primary px-12 py-5 font-bold text-lg rounded-2xl ${user.points < 10 ? "opacity-30 grayscale cursor-not-allowed" : "shadow-lg shadow-primary/20"}`}
                           >
                             ガチャを引く
                           </button>
                        </div>
                      )}
                   </div>
                </div>
            </div>

            {/* Admin/Test Cleanup Zone */}
            <div className="mt-24 pt-12 border-t border-black/5 text-center">
               <p className="text-[10px] font-bold text-foreground/10 uppercase tracking-[0.2em] mb-6">Development Tools</p>
               <button 
                 onClick={handleClearAll}
                 disabled={isCleaning}
                 className="px-10 py-4 rounded-2xl bg-error/5 text-error border border-error/10 text-xs font-black hover:bg-error/10 transition-all active:scale-95 disabled:opacity-50 inline-flex items-center gap-3"
               >
                 {isCleaning ? <Loader2 className="animate-spin" size={16} /> : <AlertCircle size={16} />}
                 {isCleaning ? "消去中..." : "すべてのテストデータを一括消去する"}
               </button>
               <p className="mt-4 text-[10px] text-foreground/10 font-medium">※すべての案件とメッセージ履歴が削除されます。開発時のみご利用ください。</p>
            </div>
          </div>
        </main>
      )}
    </ClientOnly>
  );
}

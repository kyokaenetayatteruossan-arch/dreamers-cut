"use client";

import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/context/JobContext";
import { useRouter } from "next/navigation";
import { 
  Search, Filter, Clock, Video, User as UserIcon, 
  ChevronRight, Lock, Award, Heart, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ClientOnly from "@/components/ClientOnly";
import { motion } from "framer-motion";

export default function MarketPage() {
  const { user } = useAuth();
  const { jobs, loading, acceptJob } = useJobs();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAccept = async (jobId: string) => {
    if (!user || acceptingId) return;
    if (confirm("この案件を請け負いますか？依頼者に通知が送られます。")) {
       setAcceptingId(jobId);
       try {
         await acceptJob(jobId, user.id, user.name);
         alert("案件を正式に請け負いました。自動的にプロジェクトルームへ移動します。");
         router.push(`/project/${jobId}`);
       } catch (err: any) {
         console.error("HandleAccept Error:", err);
         alert(err.message || "エラーが発生しました。もう一度お試しください。");
       } finally {
         setAcceptingId(null);
       }
    }
  };

  return (
    <ClientOnly>
      {loading ? (
        <main className="min-h-screen flex items-center justify-center pt-20 px-4 bg-background">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin glow-effect"></div>
        </main>
      ) : !user ? (
        <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center bg-background">
          <h2 className="text-xl font-bold text-white mb-6">ログインが必要です。</h2>
          <button onClick={() => router.push("/login")} className="btn-primary px-8 py-3">ログイン画面へ</button>
        </main>
      ) : (
        <main className="min-h-screen pt-28 pb-12 bg-background relative overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-secondary opacity-15 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-accent opacity-15 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

          <div className="section-container relative z-10 animate-in delay-100">
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="flex-1">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 font-bold transition-colors">
                  ◀ ダッシュボードに戻る
                </Link>
                <h1 className="text-4xl sm:text-5xl font-black mb-4 flex items-center gap-3 text-white tracking-tight drop-shadow-lg">
                   <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center float-animation shadow-inner border border-secondary/30">
                     <Video className="text-secondary" size={32} />
                   </div>
                   案件マーケット
                </h1>
                <p className="text-white/60 max-w-lg font-medium leading-relaxed">
                  現在募集中の動画編集依頼です。初心者優先枠があるため、始めたばかりの方でも安心して案件を獲得できます。
                </p>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                   <input 
                     type="text" 
                     placeholder="タイトルや要望で検索..." 
                     className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white/10 shadow-inner w-full transition-all text-white backdrop-blur-sm"
                   />
                </div>
                <button className="glass px-6 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl hover:bg-white/10 transition-colors text-white">
                   <Filter size={20} />
                   <span className="hidden sm:inline">絞り込み</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {jobs.filter(j => j.status === "pending" && j.requestorId !== user?.id).length > 0 ? (
                jobs.filter(j => j.status === "pending" && j.requestorId !== user?.id).map((job, idx) => {
                  const jobCreatedAt = new Date(job.createdAt).getTime();
                  const hoursElapsed = (currentTime - jobCreatedAt) / (1000 * 60 * 60);
                  const isBeginnerOnly = hoursElapsed < 12;
                  const isForbiddenForPro = isBeginnerOnly && user.achievements > 0;
                  
                  return (
                    <motion.div 
                      key={job.id} 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="glass-card p-8 rounded-[32px] relative overflow-hidden flex flex-col hover:shadow-2xl group group-hover:border-white/20"
                    >
                      
                      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                        {isBeginnerOnly && (
                          <div className="bg-primary/20 text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-primary/30 shadow-sm backdrop-blur-sm">
                            <Award size={14} className="text-primary" />
                            初心者優先枠・残り {Math.max(0, Math.ceil(12 - hoursElapsed))}時間
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-6 line-clamp-2 min-h-[3.5rem] tracking-tight text-white relative z-10 leading-snug">{job.title}</h3>
                      
                      <div className="space-y-4 mb-8 flex-1 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-white/50 bg-white/5 p-3 rounded-xl border border-white/5">
                           <UserIcon size={18} className="shrink-0" />
                           <span className="truncate">依頼者: <span className="text-white font-bold">{job.requestorName}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/50 bg-white/5 p-3 rounded-xl border border-white/5">
                           <Video size={18} className="shrink-0" />
                           <span className="truncate">主役キャラクター: <span className="text-white font-bold">{job.mainCharacter}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/50 bg-white/5 p-3 rounded-xl border border-white/5">
                           <Clock size={18} className="shrink-0" />
                           <span className="truncate">仕上がり長さ: <span className="text-white font-bold">{job.duration / 60}分以内</span></span>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-6 mt-auto flex justify-between items-center relative z-10">
                        <div>
                           <div className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-widest">あなたの受取報酬</div>
                           <div className="text-3xl font-black text-secondary drop-shadow-md">¥{job.reward.toLocaleString()}</div>
                        </div>
                        
                        {isForbiddenForPro ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                              <Lock size={20} className="text-white/30" />
                            </div>
                            <span className="text-[10px] text-white/50 font-bold tracking-wider">初心者ロック</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAccept(job.id)}
                            disabled={acceptingId === job.id}
                            className={`bg-secondary text-white py-3 px-6 sm:px-8 rounded-2xl text-sm font-black flex items-center gap-2 group hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/40 glow-effect ${acceptingId === job.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                             {acceptingId === job.id ? '処理中...' : (
                               <>
                                 請け負う
                                 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                               </>
                             )}
                          </button>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-32 text-center glass-card rounded-[40px] shadow-inner relative overflow-hidden backdrop-blur-xl border border-white/10">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 pointer-events-none" />
                   <Sparkles className="mx-auto mb-8 text-white/10" size={80} />
                   <p className="text-white/80 font-bold text-2xl tracking-tight mb-2">現在募集中の案件はありません</p>
                   <p className="text-base text-white/40 font-medium">誰かが特別な思い出を編集してくれるのを待っています。<br />しばらく経ってから再度ご確認ください。</p>
                   {loading && <p className="text-secondary mt-4 animate-pulse uppercase tracking-widest font-black text-xs">データ読み込み中...</p>}
                </div>
              )}
            </div>

          </div>
        </main>
      )}
    </ClientOnly>
  );
}

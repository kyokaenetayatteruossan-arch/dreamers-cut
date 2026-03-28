"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Trophy, Star, AlertCircle, Play, 
  PlusCircle, Award, ShieldCheck,
  ChevronRight, Gift, Sparkles as SparklesIcon, ArrowRight
} from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

export default function DashboardPage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary opacity-20 blur-[150px] rounded-full pointer-events-none" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-primary/20 relative z-10"></div>
          <div className="text-xl font-bold text-primary mb-4 animate-pulse relative z-10">データを読み込み中...</div>
        </main>
      ) : !user ? (
        <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-error opacity-10 blur-[150px] rounded-full pointer-events-none" />
          <div className="text-xl font-bold text-white mb-6 relative z-10">セッションが切れました。再度ログインしてください。</div>
          <button onClick={() => router.push("/login")} className="btn-primary px-8 py-3 shadow-xl relative z-10">
             ログイン画面へ
          </button>
        </main>
      ) : (
        <main className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="section-container relative z-10">
            
            {/* User Stats Card */}
            <div className="glass-card p-6 sm:p-10 rounded-[32px] mb-12 relative overflow-hidden animate-in">
              <div className="absolute top-0 right-0 w-80 h-80 bg-grad-sunset opacity-20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 hidden sm:block pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-inner float-animation overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  {user.crown !== "none" && (
                    <div className={`absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transform rotate-12 ${
                      user.crown === "gold" ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-white border-2 border-yellow-200" : "bg-gradient-to-br from-slate-300 to-slate-500 text-white border-2 border-slate-200"
                    }`}>
                      <Trophy size={20} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{user.name} <span className="text-xl font-medium text-white/50">様</span></h1>
                    <div className="flex justify-center md:justify-start items-center gap-2 sm:gap-3">
                       <div className="flex items-center gap-1 bg-white/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold border border-white/10 backdrop-blur-md">
                          <Star size={16} fill="currentColor" />
                          <span>{user.likes} いいね</span>
                       </div>
                       {user.penaltyPoints > 0 && (
                         <div className="flex items-center gap-1 bg-error/20 text-error px-4 py-1.5 rounded-full text-sm font-bold border border-error/30 animate-pulse">
                            <AlertCircle size={16} />
                            <span>ペナルティ x{user.penaltyPoints}</span>
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                       <div className="text-[10px] sm:text-xs text-white/50 mb-1 font-bold tracking-wider">実績件数</div>
                       <div className="text-xl sm:text-2xl font-black text-white">{user.achievements} <span className="text-xs font-medium text-white/40">件</span></div>
                    </div>
                    <div className="p-4 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl border border-primary/20 shadow-inner backdrop-blur-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-20"><Star className="text-primary"/></div>
                       <div className="text-[10px] sm:text-xs text-primary/80 mb-1 font-bold tracking-wider relative z-10">獲得ポイント</div>
                       <div className="text-xl sm:text-2xl font-black text-white relative z-10">{user.points} <span className="text-xs font-medium text-white/40">pt</span></div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                       <div className="text-[10px] sm:text-xs text-white/50 mb-1 font-bold tracking-wider">現在のランク</div>
                       <div className="text-sm sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 line-clamp-1">
                         {user.likes >= 500 ? "Gold Dreamer" : user.likes >= 100 ? "Silver Dreamer" : "Newbie"}
                       </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                       <div className="text-[10px] sm:text-xs text-white/50 mb-1 font-bold tracking-wider">アカウント状態</div>
                       <div className="text-xs sm:text-sm font-bold flex items-center gap-1 text-success">
                         <ShieldCheck size={16} />
                         認証済
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <PlusCircle className="text-primary" size={24} />
                  <h2 className="text-2xl font-bold text-white tracking-tight">動画を依頼する</h2>
                </div>
                <Link 
                  href="/request/new" 
                  className="block p-8 rounded-3xl bg-grad-sunset shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform group relative overflow-hidden glow-effect"
                >
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <h3 className="text-2xl font-black mb-2 relative z-10 text-white">新しい依頼を作成</h3>
                   <p className="text-white/80 text-sm mb-8 relative z-10 leading-relaxed max-w-[90%] font-medium">大切な思い出を、1分2000円から編集依頼。詳細な要望もこちらから手軽に入力できます。</p>
                   <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors relative z-10 shadow-inner float-animation">
                      <ChevronRight size={28} className="text-white" />
                   </div>
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <Award className="text-secondary" size={24} />
                  <h2 className="text-2xl font-bold text-white tracking-tight">仕事を受ける</h2>
                </div>

                {!user.hasPassedTraining ? (
                  <div className="p-8 rounded-3xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent relative overflow-hidden group backdrop-blur-md text-center">
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner float-animation">
                        <Play size={32} className="text-secondary ml-1" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white">まず学習を始めましょう</h3>
                      <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-sm mx-auto font-medium">
                        動画編集の基礎と当サービスのルールを30分で学びます。テスト合格後に正式なクリエイターとして仕事を受けられます。
                      </p>
                      <Link 
                        href="/learning" 
                        className="glass px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-lg hover:bg-white/10 transition-colors text-white font-bold"
                      >
                        学習動画を見る
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/market" 
                    className="block p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Star size={150} />
                    </div>
                    <h3 className="text-2xl font-black mb-2 relative z-10 text-white">案件を探す <span className="text-lg font-bold text-secondary ml-2">Market</span></h3>
                    <p className="text-white/60 text-sm mb-8 relative z-10 leading-relaxed max-w-[90%] font-medium">現在募集中の依頼を確認して、編集の仕事を始めましょう。初心者歓迎の案件も多数あります。</p>
                    <div className="bg-white/10 border border-white/10 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors relative z-10">
                       <ChevronRight size={28} className="text-white" />
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Gacha Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <Gift className="text-primary" size={24} />
                  <h2 className="text-2xl font-bold text-white tracking-tight">お楽しみくじ</h2>
                </div>
                
                <div className="p-8 md:p-12 rounded-[32px] glass-card relative overflow-hidden">
                   <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary opacity-20 blur-[80px] rounded-full pointer-events-none" />
                   
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
                       <div>
                        <h3 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                          <SparklesIcon className="text-yellow-400" />
                          ドリーム・ガチャ
                        </h3>
                        <p className="text-sm text-white/60 font-medium">1回 <span className="text-primary font-bold">10 pt</span> で豪華景品に挑戦！</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 w-full sm:w-auto">
                        <div className="text-xs font-bold text-white/50 tracking-wider">所持ポイント</div>
                        <div className="text-2xl font-black text-white">{user.points} <span className="text-sm font-medium text-white/40">pt</span></div>
                      </div>
                   </div>

                   <div className="bg-black/20 p-8 sm:p-12 rounded-3xl border border-white/5 text-center relative overflow-hidden shadow-inner backdrop-blur-sm">
                      {isDrawing ? (
                        <div className="animate-pulse py-8">
                           <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-inner border border-primary/30">
                             <Gift size={48} className="text-primary" />
                           </div>
                           <div className="font-black italic tracking-widest text-primary text-xl">DRAWING...</div>
                        </div>
                      ) : lastResult ? (
                        <div className="animate-in zoom-in duration-500 py-8">
                           <SparklesIcon size={56} className="mx-auto text-yellow-400 mb-6 float-animation" />
                           <div className="text-sm font-bold text-primary mb-2 bg-primary/10 inline-block px-4 py-1.5 rounded-full border border-primary/20">結果発表！</div>
                           <div className="text-2xl sm:text-4xl font-black text-white my-6 tracking-tight">{lastResult}</div>
                           <button onClick={() => setLastResult(null)} className="text-sm font-bold text-white/60 hover:text-white transition-colors flex items-center gap-2 mx-auto">
                             <Play size={16} /> もう一度引く
                           </button>
                        </div>
                      ) : (
                        <div className="relative z-10 py-8">
                           <Gift size={64} className="mx-auto text-white/20 mb-8 float-animation" />
                           <button 
                             onClick={handleDraw}
                             disabled={user.points < 10}
                             className={`btn-primary px-12 py-5 font-bold text-lg rounded-2xl ${user.points < 10 ? "opacity-30 grayscale cursor-not-allowed" : "glow-effect shadow-xl"}`}
                           >
                             ガチャを引く
                           </button>
                        </div>
                      )}
                   </div>
                </div>
            </div>

          </div>
        </main>
      )}
    </ClientOnly>
  );
}

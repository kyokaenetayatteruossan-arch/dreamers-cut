"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/context/JobContext";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, Video, Clock, 
  HelpCircle, ChevronRight, ArrowLeft,
  Sparkles, Info, ShoppingCart, Paperclip, Loader2, X
} from "lucide-react";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";

const STEPS = ["動画の基本情報", "詳細な要望", "確認・お支払い"];

export default function NewRequestPage() {
  const { user, loading: authLoading } = useAuth();
  const { addJob, uploadFile } = useJobs();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [mainCharacter, setMainCharacter] = useState("");
  const [duration, setDuration] = useState<60 | 120>(60);
  const [sentences, setSentences] = useState("");
  const [requests, setRequests] = useState<{ [key: string]: string }>({});
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = duration === 60 ? 2500 : 4500;
  const reward = duration === 60 ? 1000 : 2000;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 500MB制限 (将来的にはProプランで対応可能)
    if (file.size > 500 * 1024 * 1024) {
      alert("ファイルサイズが大きすぎます（上限500MB）。");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setReferenceUrl(url);
    } catch (err) {
      alert("ファイルのアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const jobId = await addJob({
        title,
        mainCharacter,
        sentences: referenceUrl ? `${sentences}\n\n[参考資料: ${referenceUrl}]` : sentences,
        duration,
        price,
        reward,
        requests,
        requestorId: user.id,
        requestorName: user.name,
      });

      // Stripe Checkoutセッションを作成
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: price,
          jobId,
          title,
        }),
      });

      const { url, error } = await res.json();
      if (error) throw new Error(error);

      // Stripeの決済画面にリダイレクト
      window.location.href = url;
    } catch (err) {
      console.error("Payment Error:", err);
      alert("決済画面への移動に失敗しました。もう一度お試しください。");
      setIsSubmitting(false);
    }
  };

  const intervals = useMemo(() => {
    const list = [];
    for (let i = 0; i < duration; i += 10) {
      list.push(`${i}-${i + 10}秒`);
    }
    return list;
  }, [duration]);

  return (
    <ClientOnly>
      {authLoading ? (
        <main className="min-h-screen flex items-center justify-center pt-20 px-4 bg-background">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin glow-effect"></div>
        </main>
      ) : !user ? (
        <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center bg-background">
          <h2 className="text-xl font-bold text-white mb-6">ログインが必要です。</h2>
          <button onClick={() => router.push("/login")} className="btn-primary px-8 py-3">ログイン画面へ</button>
        </main>
      ) : (
        <main className="min-h-screen pt-28 pb-12 bg-background relative overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary opacity-10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-accent opacity-10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

          <div className="section-container relative z-10 max-w-4xl mx-auto animate-in">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 font-bold transition-colors">
              <ArrowLeft size={18} />
              ダッシュボードに戻る
            </Link>

            <div className="flex justify-between items-center mb-12 gap-2 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
               {STEPS.map((s, idx) => (
                 <div key={s} className="flex items-center gap-2 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all shadow-lg ${step >= idx ? "bg-primary text-white scale-110 shadow-primary/30" : "bg-white/10 text-white/30"}`}>
                       {idx + 1}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${step >= idx ? "text-white" : "text-white/30"}`}>{s}</span>
                    {idx < STEPS.length - 1 && <div className={`w-8 h-px bg-white/10 mx-2 ${step > idx ? "bg-primary/50" : ""}`} />}
                 </div>
               ))}
            </div>

            <div className="glass-card p-8 sm:p-14 rounded-[40px] shadow-2xl relative overflow-hidden">
               {step === 0 && (
                 <div className="animate-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
                       <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shadow-inner float-animation">
                         <PlusCircle className="text-primary" size={28} />
                       </div>
                       <h2 className="text-2xl font-black text-white tracking-tight">基本情報を入力</h2>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="space-y-3">
                          <label className="text-sm font-black flex items-center gap-2 text-white/80"><Sparkles className="text-primary" size={16}/>依頼タイトル</label>
                          <input 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="例：息子の運動会の100m走をドラマチックに" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white backdrop-blur-md text-lg"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-sm font-black flex items-center gap-2 text-white/80"><Video className="text-secondary" size={16}/>主役キャラクター名</label>
                          <input 
                            value={mainCharacter}
                            onChange={e => setMainCharacter(e.target.value)}
                            placeholder="例：たろう君" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white backdrop-blur-md text-lg"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-sm font-black flex items-center gap-2 text-white/80"><Clock className="text-accent" size={16}/>仕上がりの長さ</label>
                          <div className="grid grid-cols-2 gap-4">
                             {[60, 120].map(d => (
                               <button 
                                 key={d}
                                 onClick={() => setDuration(d as 60 | 120)}
                                 className={`p-6 rounded-2xl border-2 transition-all font-black text-lg shadow-xl ${duration === d ? "border-primary bg-primary/10 text-white scale-[1.02] shadow-primary/20" : "border-white/5 bg-white/5 text-white/30 hover:bg-white/10 hover:border-white/20"}`}
                               >
                                  {d/60}分以内
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {step === 1 && (
                 <div className="animate-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
                       <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center shadow-inner float-animation">
                         <Info className="text-secondary" size={28} />
                       </div>
                       <h2 className="text-2xl font-black text-white tracking-tight">詳細な要望を伝える</h2>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-3">
                          <label className="text-sm font-black flex items-center gap-2 text-white/80">全体の雰囲気・ストーリー</label>
                          <textarea 
                            value={sentences}
                            onChange={e => setSentences(e.target.value)}
                            placeholder="どんな動画にしたいか自由に書いてください..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white h-32 backdrop-blur-md resize-none"
                          />
                       </div>

                       <div className="space-y-3">
                           <label className="text-sm font-black flex items-center gap-2 text-white/80">参考資料 (動画・画像)</label>
                           <div className="relative">
                              {referenceUrl ? (
                                <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between animate-in zoom-in">
                                   <div className="flex items-center gap-3">
                                      <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                         <Paperclip size={20} />
                                      </div>
                                      <span className="text-xs font-bold text-white/60 truncate max-w-[200px]">資料アップロード済み</span>
                                   </div>
                                   <button onClick={() => setReferenceUrl(null)} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors">
                                      <X size={20} />
                                   </button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="video/*,image/*"
                                  />
                                  <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl py-8 flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all group">
                                     {isUploading ? (
                                       <Loader2 className="text-primary animate-spin" size={32} />
                                     ) : (
                                       <Paperclip className="text-white/20 group-hover:text-primary transition-colors" size={32} />
                                     )}
                                     <div className="text-center">
                                        <p className="text-sm font-bold text-white/40">{isUploading ? "アップロード中..." : "クリックして動画や画像を添付"}</p>
                                        <p className="text-[10px] text-white/20 mt-1">最大500MBまで (参考資料として送信されます)</p>
                                     </div>
                                  </div>
                                </div>
                              )}
                           </div>
                        </div>

                       <div className="space-y-4">
                          <label className="text-sm font-black flex items-center gap-2 text-white/80"><ShoppingCart size={16} className="text-primary"/> 10秒ごとのテロップ指示 (任意)</label>
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                             {intervals.map(int => (
                               <div key={int} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white/5 p-5 rounded-2xl border border-white/10">
                                  <span className="text-xs font-black text-white/40 tracking-wider w-20 px-3 py-1 bg-white/5 rounded-lg border border-white/5 shadow-inner">{int}</span>
                                  <input 
                                    value={requests[int] || ""}
                                    onChange={e => setRequests({...requests, [int]: e.target.value})}
                                    placeholder="テロップ等を入力" 
                                    className="flex-1 bg-transparent border-none outline-none text-white font-bold w-full"
                                  />
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {step === 2 && (
                 <div className="animate-in zoom-in duration-500 text-center">
                    <div className="w-24 h-24 bg-grad-sunset rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20 float-animation border-4 border-white/10">
                       <CheckCircle size={48} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black mb-10 text-white tracking-tight">最終確認とお支払い</h2>
                    
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-10 shadow-inner">
                       <div className="flex justify-between items-center mb-6 text-lg font-bold">
                          <span className="text-white/50">基本料金 ({duration/60}分以内)</span>
                          <span className="text-white">¥{price.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center mb-8 text-lg font-bold">
                          <span className="text-white/50">システム手数料</span>
                          <span className="text-white">¥0 <span className="text-xs text-primary ml-1">(初回無料キャンペーン中！)</span></span>
                       </div>
                       <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                          <span className="text-xl font-black text-white">合計金額</span>
                          <span className="text-4xl font-black text-transparent bg-clip-text bg-grad-sunset">¥{price.toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-left flex gap-4 mb-10">
                       <HelpCircle className="text-primary shrink-0" size={24} />
                       <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">一度支払われた代金は、制作者が承認するまでシステムに「仮払い」として保管されます。トラブル時の返金対応も安心です。</p>
                    </div>
                 </div>
               )}

               <div className="flex gap-4 mt-14 pt-10 border-t border-white/10">
                  {step > 0 && (
                    <button onClick={handleBack} className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all shadow-lg active:scale-95">
                      戻る
                    </button>
                  )}
                  {step < 2 ? (
                    <button 
                      onClick={handleNext} 
                      disabled={!title || !mainCharacter}
                      className={`flex-[2] py-5 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center gap-2 group transition-all shadow-xl shadow-primary/20 active:scale-95 ${(!title || !mainCharacter) ? "opacity-30 grayscale cursor-not-allowed" : "glow-effect"}`}
                    >
                      次へ
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className={`flex-[2] py-5 rounded-2xl bg-grad-sunset text-white font-black text-xl flex items-center justify-center gap-2 group shadow-xl active:scale-95 glow-effect ${isSubmitting ? "opacity-50 cursor-wait" : ""}`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          決済処理中...
                        </>
                      ) : (
                        <>
                          決済して依頼を投稿する
                          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
               </div>
            </div>
          </div>
        </main>
      )}
    </ClientOnly>
  );
}

function CheckCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

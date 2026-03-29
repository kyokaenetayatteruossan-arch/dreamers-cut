"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Play, CheckCircle, ChevronRight, 
  ArrowLeft, Award, Sparkles, BookOpen
} from "lucide-react";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";

const QUESTIONS = [
  {
    q: "当サービスのクレームに関する基本ルールは？",
    a: ["基本ノークレーム。お互いに良好な関係を築く。", "プロ級の品質を保証し、無制限で修正を行う。", "運営が全責任を負う。"],
    correct: 0,
  },
  {
    q: "納品後、何時間以内に依頼者が『問題あり（キャンセル）』ボタンを押さなければシステム完了となりますか？",
    a: ["24時間以内", "12時間以内", "1週間以内"],
    correct: 1,
  },
  {
    q: "1分以内の動画編集で、制作者が得られる報酬はいくらですか？",
    a: ["2,000円 (全額)", "1,000円", "500円"],
    correct: 1,
  },
  {
    q: "依頼内容には、最大何秒刻みでテロップ等の要望が入る可能性がありますか？",
    a: ["1分（60秒）刻み", "なし（制作者にお任せ）", "10秒刻み"],
    correct: 2,
  },
  {
    q: "どのような動画が本サービスの主な編集対象ですか？",
    a: ["家族、ペット、運動会など日常の特別な思い出動画", "プロ向けの本格的な企業PR動画", "違法、アダルト、著作権侵害を含む動画"],
    correct: 0,
  },
];

export default function LearningPage() {
  const { user, passTest } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"video" | "quiz" | "passed">("video");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const handleNext = () => {
    if (selected === QUESTIONS[currentQ].correct) {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        passTest();
        setStep("passed");
      }
    } else {
      alert("残念！動画をしっかり思い出し、もう一度考えてみてください。");
      setSelected(null);
    }
  };

  return (
    <ClientOnly>
      {!user ? (
        <main className="min-h-screen flex items-center justify-center pt-20 px-4 bg-background">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
      ) : (
        <main className="min-h-screen pt-24 pb-12 bg-background flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-secondary opacity-5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary opacity-5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />

          <div className="section-container max-w-3xl w-full relative z-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary mb-8 transition-colors font-bold tracking-wide">
              <ArrowLeft size={18} />
              ダッシュボードに戻る
            </Link>
            
            {/* Progress Tracker */}
            <div className="flex gap-4 mb-10 w-full animate-in slide-in-from-top-4">
               <div className={`flex-1 h-3 rounded-full transition-all duration-500 shadow-sm ${step === "video" ? "bg-primary shadow-primary/20" : "bg-success"}`} />
               <div className={`flex-1 h-3 rounded-full transition-all duration-500 shadow-sm ${step === "quiz" ? "bg-primary shadow-primary/20" : step === "passed" ? "bg-success" : "bg-black/5"}`} />
               <div className={`flex-1 h-3 rounded-full transition-all duration-500 shadow-sm ${step === "passed" ? "bg-success shadow-success/20" : "bg-black/5"}`} />
            </div>

            {step === "video" && (
              <div className="glass-card p-8 sm:p-14 rounded-[40px] text-center shadow-xl relative animate-in fade-in duration-500 border border-black/5">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

                 <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-black tracking-widest mb-8 border border-primary/20">
                   <BookOpen size={16} />
                   STEP 1: 学習動画を視聴
                 </div>
                 <h1 className="text-4xl font-black mb-8 text-foreground tracking-tight">動画編集の基礎。</h1>
                 
                 <div className="aspect-video bg-black/5 rounded-3xl mb-10 flex items-center justify-center relative group overflow-hidden shadow-inner border border-black/5 backdrop-blur-md">
                    <Play size={80} className="text-foreground opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all cursor-pointer float-animation" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                 </div>

                 <p className="text-foreground/50 mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                    基本カット、テロップの入れ方、そして当サービス「Dreamer&apos;s Cut」の心構えについて。<br/>30分の動画でしっかり学び、クリエイターとしての第一歩を踏み出しましょう。
                 </p>

                 <button onClick={() => setStep("quiz")} className="btn-primary flex items-center gap-3 mx-auto py-5 px-10 text-xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    学習完了。テストに進む
                    <ChevronRight size={24} />
                 </button>
              </div>
            )}

            {step === "quiz" && (
              <div className="glass-card p-10 sm:p-14 rounded-[40px] shadow-xl relative animate-in slide-in-from-right duration-500 border border-black/5">
                 <div className="text-center mb-10">
                     <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-black tracking-widest mb-6 border border-secondary/20">
                       <Award size={16} />
                       STEP 2: 理解度テスト ({currentQ + 1} / {QUESTIONS.length})
                     </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-relaxed">{QUESTIONS[currentQ].q}</h1>
                 </div>

                 <div className="space-y-4 mb-12">
                    {QUESTIONS[currentQ].a.map((option, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={`w-full text-left p-6 sm:p-8 flex items-center gap-5 rounded-3xl border-2 transition-all font-bold group ${
                          selected === idx 
                          ? "border-primary bg-primary/5 text-foreground shadow-lg scale-[1.01]" 
                          : "border-black/5 bg-black/[0.02] text-foreground/40 hover:bg-black/[0.04] hover:border-black/10 hover:text-foreground"
                        }`}
                      >
                         <div className={`w-8 h-8 shrink-0 rounded-full border-[3px] flex items-center justify-center transition-colors ${selected === idx ? "border-primary bg-transparent" : "border-black/10 group-hover:border-black/20"}`}>
                            {selected === idx && <div className="w-4 h-4 rounded-full bg-primary" />}
                         </div>
                         <span className="leading-relaxed text-lg">{option}</span>
                      </button>
                    ))}
                 </div>

                 <button 
                   onClick={handleNext} 
                   disabled={selected === null}
                   className={`btn-primary w-full py-6 flex items-center justify-center gap-3 text-2xl font-black rounded-3xl transition-all shadow-lg shadow-primary/10 ${selected === null ? "opacity-30 grayscale cursor-not-allowed" : "active:scale-95 shadow-primary/20"}`}
                 >
                    次へ
                    <ChevronRight size={28} />
                 </button>
              </div>
            )}

            {step === "passed" && (
              <div className="glass-card p-12 sm:p-20 rounded-[40px] text-center shadow-xl border-2 border-success/10 relative overflow-hidden animate-in zoom-in duration-700">
                 <div className="absolute inset-0 bg-gradient-to-b from-success/10 to-transparent pointer-events-none blur-3xl opacity-30" />
                 
                 <div className="w-32 h-32 bg-gradient-to-br from-success to-emerald-400 rounded-full flex items-center justify-center text-white mx-auto mb-10 shadow-xl shadow-success/20 animate-bounce relative z-10">
                    <CheckCircle size={80} />
                 </div>
                 
                 <Sparkles className="text-yellow-500 mx-auto mb-6 float-animation relative z-10" size={56} />
                 <h1 className="text-4xl sm:text-5xl font-black mb-6 text-foreground tracking-tight relative z-10">合格おめでとう！</h1>
                 
                 <p className="text-foreground/60 mb-12 max-w-lg mx-auto font-medium leading-relaxed text-lg relative z-10">
                    これであなたは「Dreamer&apos;s Cut」の公認クリエイターです。<br/><br/>
                    今日から案件を受けて、誰かの特別な思い出を輝かせ、夢への第一歩を踏み出しましょう！
                 </p>

                 <Link href="/dashboard" className="bg-gradient-to-r from-success to-emerald-500 text-white rounded-3xl flex items-center justify-center gap-3 py-6 px-12 text-2xl font-black shadow-lg shadow-success/20 active:scale-95 transition-all outline-none hover:scale-105 relative z-10 mx-auto max-w-md">
                    ダッシュボードに戻る
                    <ChevronRight size={28} />
                 </Link>
              </div>
            )}
          </div>
        </main>
      )}
    </ClientOnly>
  );
}

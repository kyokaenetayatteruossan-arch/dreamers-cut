"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ClientOnly from "@/components/ClientOnly";
import { useJobs } from "@/context/JobContext";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateJobStatus } = useJobs();
  const [countdown, setCountdown] = useState(5);
  const jobId = searchParams.get("job_id");

  useEffect(() => {
    // 決済成功後のステータス更新処理
    const finalizePayment = async () => {
      if (jobId) {
        try {
          console.log("Payment successful for job:", jobId);
          // 必要に応じてここでステータスを更新するロジックを追加
        } catch (err) {
          console.error("Error finalizing payment:", err);
        }
      }
    };

    finalizePayment();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [jobId, router]);

  return (
    <main className="min-h-screen flex items-center justify-center pt-20 px-4 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-lg w-full relative z-10 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-10 sm:p-16 rounded-[40px] shadow-2xl"
        >
          <div className="w-24 h-24 bg-grad-sunset rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20 float-animation border-4 border-white/10">
            <CheckCircle size={48} className="text-white" />
          </div>

          <h1 className="text-4xl font-black text-white mb-6 tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400" />
            決済が完了しました！
          </h1>
          
          <p className="text-white/60 text-lg mb-10 leading-relaxed font-medium">
            ご依頼ありがとうございます！<br />
            クリエイターが内容を確認し、<br />
            承認されるまで少々お待ちください。
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Status</div>
              <div className="text-success font-black flex items-center gap-1">
                 <CheckCircle size={14} /> 支払い済み
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Next Step</div>
              <div className="text-white font-black text-sm">マッチング待ち</div>
            </div>
          </div>

          <button 
            onClick={() => router.push("/dashboard")}
            className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold glow-effect group transition-all"
          >
            ダッシュボードへ戻る
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-2 text-white/30 text-xs font-bold">
            <Loader2 size={14} className="animate-spin" />
            <span>{countdown}秒後に自動で移動します...</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <ClientOnly>
      <Suspense fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 size={48} className="text-primary animate-spin" />
        </main>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </ClientOnly>
  );
}

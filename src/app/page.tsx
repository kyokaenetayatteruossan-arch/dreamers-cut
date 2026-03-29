"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Heart, Star, Sparkles, ArrowRight, ExternalLink, ShieldCheck, Clock, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Family Memories Cinematic"
            fill
            className="object-cover brightness-[0.35] scale-105 float-animation"
            style={{ animationDuration: '30s' }}
            priority
          />
          {/* 高級感のあるグラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-primary/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
          
          {/* 動的な光の演出 */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="section-container relative z-10 text-center px-6"
        >
          <div className="max-w-4xl mx-auto py-12 px-6 rounded-[3rem] backdrop-blur-[2px] bg-white/[0.02] border border-white/[0.05] shadow-2xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-10 text-primary-light"
            >
              <Sparkles size={14} className="animate-spin-slow" />
              <span>夢追い人の応援プロジェクト</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
              特別な思い出を、<br />
              <span className="text-grad-sunset italic">もっと特別に。</span>
            </h1>
            
            <p className="text-base md:text-xl max-w-2xl mx-auto mb-12 text-white/60 font-medium leading-relaxed tracking-tight px-4">
              家族の笑顔、ペットの寝顔、旅行の感動。<br className="hidden md:block" />
              何気ない日常の動画に、<span className="text-white">プロ級の魔法</span>を吹き込みます。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link 
                href="/request/new" 
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-3 group px-12 py-6 text-lg font-black rounded-2xl shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                動画編集を依頼する
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/market" 
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-6 text-lg font-black rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all group"
              >
                <Play size={22} className="text-secondary group-hover:scale-110 transition-transform" fill="currentColor" />
                編集して夢を叶える
              </Link>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Already have an account?</span>
              <Link 
                href="/login" 
                className="text-xs font-black text-white hover:text-primary-light transition-colors border-b border-white/10 hover:border-primary-light pb-0.5"
              >
                こちらからログイン
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* 下部へのスクロールを促す演出 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 opacity-30 animate-bounce">
           <div className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </section>

      {/* Concept Section */}
      <section id="concept" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
        <div className="section-container text-center relative z-10">
          <h2 className="text-3xl md:text-5xl mb-4 font-extrabold tracking-tight">なぜ、Dreamer&apos;s Cut なのか</h2>
          <p className="text-foreground/50 mb-16 max-w-2xl mx-auto">プロ品質を求めない代わりに、安価で温かみのあるやりとりを重視しています。初心者でも安心して飛び込めるやさしい世界を目指しています。</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl glass-card text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
                <Heart size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">価値ある仕事</h3>
              <p className="text-foreground/70 leading-relaxed">
                誰かの特別な思い出に「BGM」や「テロップ」という魔法をかける。感謝されながら報酬を得られる、とてもやりがいのある仕事です。
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl glass-card text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-secondary/20">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">誰でも今日から挑戦</h3>
              <p className="text-foreground/70 leading-relaxed">
                サイト内の「30分学習動画」を見るだけで基本をマスター！テストに合格すれば、育児中のママさんや学生でもすぐに始められます。
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-3xl glass-card text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success to-teal-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-success/20">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">安心のエスクロー決済</h3>
              <p className="text-foreground/70 leading-relaxed">
                依頼時の事前決済（仮払い）システムを導入。未払いの心配もなく、サイト内チャットで安全に動画の受け渡しが完了します。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promotion Slider (High Achievers) */}
      <section className="py-24 relative overflow-hidden bg-white/5">
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="section-container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-secondary font-bold mb-2">
                <Star size={18} fill="currentColor" />
                <span>HALL OF FAME</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">今月の特大ドリーマー</h2>
              <p className="text-foreground/50">実績100件を突破したトップクリエイターへの特典として、無料でサイト内宣伝枠を提供しています。</p>
            </div>
            <Link href="/market" className="text-sm font-bold text-gradient flex items-center gap-1 hover:opacity-80 transition-opacity">
              案件を探してトップを目指す <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-8 snap-x no-scrollbar">
             {[
               { name: "サトシ", jobs: 124, msg: "主にペット動画を得意としています！インスタも見てね。最高の思い出を作ろう！", link: "https://instagram.com" },
               { name: "ユキ", jobs: 310, msg: "家族の記念日動画ならお任せください。将来は映画監督を目指して勉強中です！", link: "https://youtube.com" },
               { name: "ケンタ", jobs: 105, msg: "スポーツイベントのダイジェスト編集をしています。自営業の宣伝も兼ねてます！", link: "https://kenta-edit.com" }
             ].map((p, idx) => (
                <div key={idx} className="min-w-[320px] md:min-w-[420px] glass-card p-8 rounded-3xl snap-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Star size={80} fill="currentColor" className="text-secondary" />
                   </div>
                   <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-16 h-16 rounded-full bg-grad-sunset flex items-center justify-center text-white text-2xl font-bold border-4 border-background shadow-lg shadow-primary/30">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                         <div className="text-xl font-bold">{p.name} 様</div>
                         <div className="text-sm text-secondary font-bold flex items-center gap-1 mt-1">
                            <Star size={14} fill="currentColor" />
                            実績 {p.jobs} 件達成
                         </div>
                      </div>
                   </div>
                   <p className="text-base leading-relaxed text-foreground/80 mb-8 min-h-[4rem] relative z-10 italic">
                      「{p.msg}」
                   </p>
                   <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors relative z-10">
                      <ExternalLink size={16} />
                      公式サイト / SNS を見る
                   </a>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Pricing / Business Model */}
      <section className="py-24 relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="glass-card rounded-[40px] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20 z-0" />
            
            <div className="flex flex-col md:flex-row gap-16 items-center relative z-10">
              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
                  <Clock size={18} />
                  <span>シンプル料金体系</span>
                </div>
                <h2 className="text-4xl md:text-5xl mb-8 font-extrabold tracking-tight leading-tight">明朗会計だから、<br />お互いに気持ちいい。</h2>
                <p className="text-white/70 mb-8 text-lg leading-relaxed">
                  依頼者様は手軽に注文でき、制作者様はしっかりと報酬を得られる。
                  夢を応援するための透明な仕組みを実現しました。「ノークレーム」を大前提とし、温かい気持ちで取引が行われます。
                </p>
                <div className="flex  gap-4 mt-8">
                  <Link href="/request/new" className="btn-primary px-8 py-4">今すぐ依頼する</Link>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                 {/* Pricing Cards */}
                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
                    <div className="text-sm font-bold text-accent mb-2 tracking-wider">依頼者様 支払</div>
                    <div className="text-3xl font-black mb-1">¥2,000</div>
                    <div className="text-xs text-white/50 mb-4 pb-4 border-b border-white/10">1分以内の動画編集</div>
                    <ul className="text-sm space-y-2 text-white/80">
                      <li>✓ 基本テロップ入れ</li>
                      <li>✓ BGM・効果音</li>
                      <li>✓ 10秒毎の詳細要望可</li>
                    </ul>
                 </div>
                 <div className="p-6 bg-gradient-to-b from-primary/20 to-transparent border border-primary/30 rounded-2xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Star size={24} className="text-primary"/></div>
                    <div className="text-sm font-bold text-primary mb-2 tracking-wider">制作者様 受取</div>
                    <div className="text-3xl font-black mb-1">¥1,000</div>
                    <div className="text-xs text-white/50 mb-4 pb-4 border-b border-white/10">1件あたりの報酬</div>
                    <ul className="text-sm space-y-2 text-white/80">
                      <li>✓ 学習動画でサポート</li>
                      <li>✓ サイト内チャット完結</li>
                      <li>✓ 未払い防止の仮払い</li>
                    </ul>
                 </div>
                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
                    <div className="text-sm font-bold text-accent mb-2 tracking-wider">依頼者様 支払</div>
                    <div className="text-3xl font-black mb-1">¥3,000</div>
                    <div className="text-xs text-white/50 mb-4 pb-4 border-b border-white/10">2分以内の動画編集</div>
                    <ul className="text-sm space-y-2 text-white/80">
                      <li>✓ 基本テロップ入れ</li>
                      <li>✓ BGM・効果音</li>
                      <li>✓ 10秒毎の詳細要望可</li>
                    </ul>
                 </div>
                 <div className="p-6 bg-gradient-to-b from-primary/20 to-transparent border border-primary/30 rounded-2xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Star size={24} className="text-primary"/></div>
                    <div className="text-sm font-bold text-primary mb-2 tracking-wider">制作者様 受取</div>
                    <div className="text-3xl font-black mb-1">¥2,000</div>
                    <div className="text-xs text-white/50 mb-4 pb-4 border-b border-white/10">1件あたりの報酬</div>
                    <ul className="text-sm space-y-2 text-white/80">
                      <li>✓ 学習動画でサポート</li>
                      <li>✓ サイト内チャット完結</li>
                      <li>✓ 未払い防止の仮払い</li>
                    </ul>
                 </div>
              </div>
            </div>
            
            <div className="text-center mt-10 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md relative z-10 text-sm text-white/60">
              ※ 差額の1,000円はプラットフォーム維持費および、システムを円滑に運営するための「夢追い人の応援費」に充てられます。
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-glass-border bg-background relative z-10">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-grad-sunset flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Sparkles size={20} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Dreamer&apos;s Cut
            </span>
          </div>
          <div className="flex gap-8 text-sm text-foreground/50 font-medium">
            <Link href="#" className="hover:text-primary transition-colors">利用規約</Link>
            <Link href="#" className="hover:text-primary transition-colors">プライバシーポリシー</Link>
            <Link href="#" className="hover:text-primary transition-colors">お問い合わせ</Link>
          </div>
          <div className="text-sm text-foreground/40 font-medium">
            © 2026 Dreamer&apos;s Cut Project.
          </div>
        </div>
      </footer>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Heart, Star, Sparkles, ArrowRight, ExternalLink, ShieldCheck, Clock, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ===== Hero: 写真 + キャッチコピーだけ ===== */}
      <section className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_light.png"
            alt="Family Memories Cinematic"
            fill
            className="object-cover brightness-110 object-center scale-105"
            priority
          />
          {/* テキストを読みやすくするための微妙なグラデーション */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10" />
        </div>

        {/* コロッサルテキストレイアウト: 画面全体をキャンバスに使用 */}
        <div className="absolute inset-0 z-10 pointer-events-none h-full flex flex-col justify-center gap-16 px-6 md:block overflow-visible">
          {/* 左上パーツ / モバイルでは上部 */}
          <motion.div
            initial={{ opacity: 0, x: -150, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative md:absolute md:top-[25vh] md:left-[5vw]"
          >
            <h1 
              style={{ 
                fontSize: 'clamp(2rem, 8vw, 10rem)', 
                lineHeight: '1.6',
                textShadow: '0 20px 40px rgba(0,0,0,0.15)',
                paddingTop: '0.6em'
              }}
              className="font-black tracking-tighter text-foreground whitespace-nowrap select-none text-left w-max"
            >
              「特別な思い出」を、
            </h1>
          </motion.div>

          {/* 右下パーツ / モバイルでは下部 */}
          <motion.div
            initial={{ opacity: 0, x: 150, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative md:absolute md:bottom-[15vh] md:right-[5vw]"
          >
            <h1 
              style={{ 
                fontSize: 'clamp(1.5rem, 8vw, 12rem)', 
                lineHeight: '1.6',
                textShadow: '0 30px 60px rgba(0,0,0,0.2)',
                paddingTop: '0.5em'
              }}
              className="font-black tracking-tighter text-foreground text-right italic select-none whitespace-nowrap w-max ml-auto md:ml-0"
            >
              <span className="text-gradient inline whitespace-nowrap">“もっと特別”に！</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-background border-b border-black/5 overflow-visible">
        {/* 白バナー (White Banner) - 左右に装飾を追加 */}
        <div className="w-full relative overflow-hidden shadow-sm">
          <div className="w-full px-4 md:px-14 py-8 md:py-16 bg-white border-y border-black/5 relative">
            {/* 背景の装飾ドットパターン (左右) */}
            <div className="absolute left-0 top-0 h-full w-1/4 opacity-[0.03] pointer-events-none hidden md:block" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute right-0 top-0 h-full w-1/4 opacity-[0.03] pointer-events-none hidden md:block" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* 左右にふわふわ浮くアイコン装飾 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[5%] top-1/4 text-primary/10 hidden lg:block"
            >
              <Sparkles size={48} />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute right-[5%] bottom-1/4 text-accent/10 hidden lg:block"
            >
              <Heart size={48} />
            </motion.div>

            <h2 className="text-black text-[1.8rem] xs:text-[2.2rem] md:text-7xl font-black tracking-tighter leading-none md:leading-tight text-center max-w-7xl mx-auto relative z-10">
              <span className="block md:inline whitespace-nowrap">何気ない動画が</span>
              <span className="block md:inline md:ml-6 mt-1 md:mt-0 scale-y-110">
                ”<span className="text-gradient">一生モノの思い出</span>”に！
              </span>
            </h2>
          </div>
        </div>

        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full text-center"
          >

            {/* シンプルで大きな角丸ボタン (Simple Large Rounded Buttons) */}
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-4xl mx-auto px-4">
                {/* 依頼者向けボタン */}
                <Link 
                  href="/request/new" 
                  className="flex-1 group bg-primary text-white px-10 py-8 text-2xl font-black rounded-[2.5rem] shadow-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-2"
                >
                  <span className="flex items-center gap-3">
                    動画編集を依頼する <ArrowRight size={28} />
                  </span>
                </Link>

                {/* 編集者向けボタン */}
                <Link 
                  href="/market" 
                  className="flex-1 group bg-white border-4 border-primary/20 text-foreground px-10 py-8 text-2xl font-black rounded-[2.5rem] shadow-xl hover:bg-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-2"
                >
                  <span className="flex items-center gap-3">
                    <Play size={28} className="text-secondary fill-current" />
                    編集して夢を叶える
                  </span>
                </Link>
              </div>

              {/* 注意書き */}
              <p className="text-base font-bold text-foreground/30 flex items-center gap-2">
                <Sparkles size={20} className="text-secondary" />
                初心者・未経験者でも大歓迎のやさしいコミュニティ
              </p>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Concept Section */}
      <section id="concept" className="py-24 relative overflow-hidden bg-indigo-50/50 border-y border-indigo-100/50">
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
      <section className="py-24 relative overflow-hidden bg-rose-50/50 border-b border-rose-100/30">
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
            <Link href="/market" className="text-sm font-black text-gradient flex items-center gap-1 hover:opacity-80 transition-opacity whitespace-nowrap">
              案件を探してトップを目指す <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex gap-10 overflow-x-auto pb-12 snap-x no-scrollbar">
             {[
               { name: "サトシ", jobs: 124, msg: "主にペット動画を得意としています！インスタも見てね。最高の思い出を作ろう！", link: "https://instagram.com" },
               { name: "ユキ", jobs: 310, msg: "家族の記念日動画ならお任せください。将来は映画監督を目指して勉強中です！", link: "https://youtube.com" },
               { name: "ケンタ", jobs: 105, msg: "スポーツイベントのダイジェスト編集をしています。自営業の宣伝も兼ねてます！", link: "https://kenta-edit.com" }
             ].map((p, idx) => (
                <div key={idx} className="min-w-[320px] md:min-w-[480px] glass-card p-10 md:p-12 rounded-[2.5rem] snap-center relative overflow-hidden border border-primary/10 shadow-xl hover:shadow-2xl transition-all">
                   <div className="absolute top-0 right-0 p-6 opacity-10">
                     <Star size={100} fill="currentColor" className="text-secondary" />
                   </div>
                   <div className="flex items-center gap-6 mb-8 relative z-10">
                      <div className="w-20 h-20 rounded-full bg-grad-sunset flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-lg shadow-primary/20">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                         <div className="text-2xl font-black text-foreground">{p.name} 様</div>
                         <div className="text-base text-secondary font-black flex items-center gap-1.5 mt-1">
                            <Star size={18} fill="currentColor" />
                            実績 {p.jobs} 件達成
                         </div>
                      </div>
                   </div>
                   <p className="text-lg leading-relaxed text-foreground/80 mb-10 min-h-[5rem] relative z-10 italic font-bold">
                      「{p.msg}」
                   </p>
                   <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full gap-2 text-[13px] font-extrabold bg-black/5 hover:bg-black/10 text-foreground px-4 py-3.5 rounded-xl transition-all relative z-10 border border-black/5 whitespace-nowrap group/btn shadow-sm">
                      <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" />
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
                <h2 className="text-4xl md:text-5xl mb-8 font-extrabold tracking-tight leading-tight text-foreground">明朗会計だから、<br />お互いに気持ちいい。</h2>
                <p className="text-foreground/60 mb-8 text-lg leading-relaxed font-bold">
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
                    <div className="text-xs text-foreground/40 mb-4 pb-4 border-b border-black/5">1分以内の動画編集</div>
                    <ul className="text-sm space-y-2 text-foreground/70 font-semibold">
                      <li>✓ 基本テロップ入れ</li>
                      <li>✓ BGM・効果音</li>
                      <li>✓ 10秒毎の詳細要望可</li>
                    </ul>
                 </div>
                 <div className="p-6 bg-gradient-to-b from-primary/20 to-transparent border border-primary/30 rounded-2xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Star size={24} className="text-primary"/></div>
                    <div className="text-sm font-bold text-primary mb-2 tracking-wider">制作者様 受取</div>
                    <div className="text-3xl font-black mb-1">¥1,000</div>
                    <div className="text-xs text-foreground/40 mb-4 pb-4 border-b border-black/5">1件あたりの報酬</div>
                    <ul className="text-sm space-y-2 text-foreground/70 font-semibold">
                      <li>✓ 学習動画でサポート</li>
                      <li>✓ サイト内チャット完結</li>
                      <li>✓ 未払い防止の仮払い</li>
                    </ul>
                 </div>
                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
                    <div className="text-sm font-bold text-accent mb-2 tracking-wider">依頼者様 支払</div>
                    <div className="text-3xl font-black mb-1">¥3,000</div>
                    <div className="text-xs text-foreground/40 mb-4 pb-4 border-b border-black/5">2分以内の動画編集</div>
                    <ul className="text-sm space-y-2 text-foreground/70 font-semibold">
                      <li>✓ 基本テロップ入れ</li>
                      <li>✓ BGM・効果音</li>
                      <li>✓ 10秒毎の詳細要望可</li>
                    </ul>
                 </div>
                 <div className="p-6 bg-gradient-to-b from-primary/20 to-transparent border border-primary/30 rounded-2xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Star size={24} className="text-primary"/></div>
                    <div className="text-sm font-bold text-primary mb-2 tracking-wider">制作者様 受取</div>
                    <div className="text-3xl font-black mb-1">¥2,000</div>
                    <div className="text-xs text-foreground/40 mb-4 pb-4 border-b border-black/5">1件あたりの報酬</div>
                    <ul className="text-sm space-y-2 text-foreground/70 font-semibold">
                      <li>✓ 学習動画でサポート</li>
                      <li>✓ サイト内チャット完結</li>
                      <li>✓ 未払い防止の仮払い</li>
                    </ul>
                 </div>
              </div>
            </div>
            
            <div className="text-center mt-10 p-4 bg-black/5 rounded-xl border border-black/5 backdrop-blur-md relative z-10 text-sm text-foreground/40 font-bold">
              ※ 差額の1,000円はプラットフォーム維持費および、システムを円滑に運営するための「夢追い人の応援費」に充てられます。
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-glass-border bg-background relative z-10">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-grad-sunset flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Sparkles size={20} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">
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

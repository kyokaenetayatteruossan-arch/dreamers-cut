"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useJobs, Job } from "@/context/JobContext";
import { useParams, useRouter } from "next/navigation";
import { 
  Send, Paperclip, MessageSquare, 
  CheckCircle, Clock, AlertTriangle, 
  ArrowLeft, Info, Sparkles, User, History,
  FileIcon, Image as ImageIcon, Video as VideoIcon, Loader2, Download
} from "lucide-react";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";

export default function ProjectRoomPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { jobs, loading: jobsLoading, updateJobStatus, sendMessage, uploadFile } = useJobs();
  const router = useRouter();
  
  const [inputText, setInputText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const job = useMemo(() => jobs.find(j => j.id === id), [jobs, id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [job?.messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !job) return;
    try {
      await sendMessage(job.id, user.id, user.name, inputText);
      setInputText("");
    } catch (err) {
      alert("メッセージの送信に失敗しました。");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !job) return;

    // 50MB制限 (簡易)
    if (file.size > 50 * 1024 * 1024) {
      alert("ファイルサイズが大きすぎます（上限50MB）。");
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await uploadFile(file);
      if (publicUrl) {
        const fileType = file.type.startsWith('video/') ? '動画' : 
                         file.type.startsWith('image/') ? '画像' : 'ファイル';
        await sendMessage(job.id, user.id, user.name, `[${fileType}を添付しました]`, publicUrl);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("ファイルのアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleStatusChange = async (status: Job["status"]) => {
    if (!job) return;
    const confirmMsg = status === "delivered" ? "納品しますか？" : 
                      status === "completed" ? "完了（お支払い確定）しますか？" : 
                      "キャンセル（白紙撤回）しますか？";
                      
    if (confirm(confirmMsg)) {
       try {
         await updateJobStatus(job.id, status);
       } catch (err) {
         alert("ステータスの更新に失敗しました。");
       }
    }
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (authLoading || jobsLoading) {
    return (
      <ClientOnly>
        <main className="min-h-screen flex items-center justify-center pt-20 px-4 bg-background">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin glow-effect"></div>
        </main>
      </ClientOnly>
    );
  }

  if (!job) {
    return (
      <ClientOnly>
        <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center bg-background">
          <AlertTriangle size={64} className="text-error mb-6 float-animation" />
          <h2 className="text-2xl font-black text-white mb-4">プロジェクトが見つかりません</h2>
          <Link href="/dashboard" className="btn-primary px-8 py-3 shadow-xl">ダッシュボードに戻る</Link>
        </main>
      </ClientOnly>
    );
  }

  const isRequestor = user?.id === job.requestorId;

  return (
    <ClientOnly>
      <main className="min-h-screen pt-24 pb-12 bg-background flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50" />

        <div className="section-container flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-140px)] relative z-10 transition-all">
          
          {/* Sidebar: Details */}
          <div className="w-full lg:w-96 flex flex-col gap-4 lg:h-full overflow-y-auto no-scrollbar lg:pr-2">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-2 font-bold transition-colors">
              <ArrowLeft size={18} />
              戻る
            </Link>

            <div className="glass-card p-6 sm:p-8 rounded-[32px] shadow-2xl relative">
              <div className="flex items-center gap-2 mb-6 px-2">
                 <div className={`w-3 h-3 rounded-full animate-pulse ${job.status === 'completed' ? 'bg-success' : 'bg-primary'}`} />
                 <span className="text-xs font-black uppercase tracking-widest text-white/60">
                   {job.status === "ongoing" ? "制作中" : 
                    job.status === "delivered" ? "納品確認中" : 
                    job.status === "completed" ? "制作完了" : 
                    job.status === "cancelled" ? "キャンセル済み" : "待機中"}
                 </span>
              </div>

              <h2 className="text-2xl font-black mb-6 text-white leading-tight tracking-tight">{job.title}</h2>
              
              <div className="space-y-6">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                  <div className="text-[10px] font-bold text-white/40 mb-3 uppercase tracking-tighter">案件詳細</div>
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <div className="p-2 bg-primary/10 rounded-lg"><User size={16} className="text-primary"/></div>
                        {isRequestor ? `制作者: ${job.providerName || "未定"}` : `依頼主: ${job.requestorName}`}
                     </div>
                     <div className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <div className="p-2 bg-secondary/10 rounded-lg"><Clock size={16} className="text-secondary"/></div>
                        {job.duration/60}分以内 / ¥{job.reward.toLocaleString()}
                     </div>
                  </div>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                  <div className="text-[10px] font-bold text-white/40 mb-3 uppercase tracking-tighter">プロジェクト進行</div>
                  <div className="space-y-4 pt-2">
                    {/* Status Actions */}
                    {job.status === "ongoing" && !isRequestor && (
                      <button onClick={() => handleStatusChange("delivered")} className="btn-primary w-full py-5 text-sm font-black flex items-center justify-center gap-2 glow-effect shadow-primary/20">
                         <CheckCircle size={18}/> 納品データを送る
                      </button>
                    )}
                    {job.status === "delivered" && isRequestor && (
                      <div className="space-y-4">
                        <button onClick={() => handleStatusChange("completed")} className="w-full py-5 bg-success text-white rounded-2xl text-sm font-black shadow-lg shadow-success/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                          <CheckCircle size={18}/> 完了を承認（支払い）
                        </button>
                        <button onClick={() => handleStatusChange("ongoing")} className="w-full py-4 bg-white/10 text-white rounded-2xl text-xs font-bold hover:bg-white/20 transition-colors uppercase tracking-widest">
                          修正をリクエスト
                        </button>
                      </div>
                    )}
                    {(job.status === "ongoing" || job.status === "delivered") && (
                       <button onClick={() => handleStatusChange("cancelled")} className="w-full py-4 bg-error/10 text-error/80 rounded-xl text-[10px] font-black hover:bg-error/20 transition-colors uppercase tracking-widest border border-error/20 mt-6">
                          問題あり（中断申請）
                       </button>
                    )}
                    {job.status === "completed" && (
                       <div className="p-6 bg-success/10 border border-success/30 rounded-3xl animate-in zoom-in">
                          <div className="flex items-center gap-2 text-success font-black text-sm mb-2">
                             <Sparkles size={18}/> おめでとうございます！
                          </div>
                          <p className="text-xs text-white/60 font-bold leading-relaxed">このプロジェクトは正常に完了し、報酬のお支払いが確定しました。</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex items-center gap-3 text-[10px] text-white/30 font-bold px-2 bg-white/5 p-3 rounded-xl border border-white/5">
                 <Info size={16}/>
                 公序良俗に反するやり取りは禁止です。
              </div>
            </div>
          </div>

          {/* Main: Chat Area */}
          <div className="flex-1 flex flex-col bg-white/5 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md min-h-[500px] lg:h-full">
            
            {/* Chat Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-20">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-grad-sunset flex items-center justify-center text-white shadow-lg float-animation">
                     <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg tracking-tight">プロジェクト・チャット</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-1">
                       <History size={12}/> {job.messages.length} メッセージ
                    </div>
                  </div>
               </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 no-scrollbar relative z-10">
              {job.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                   <MessageSquare size={64} className="mb-6 float-animation" />
                   <div className="text-xl font-black mb-2">メッセージはまだありません</div>
                   <p className="text-sm font-medium">まずは挨拶から始めましょう！</p>
                </div>
              ) : (
                job.messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.senderId === user?.id ? "items-end" : "items-start"} group animate-in slide-in-from-bottom-2`}>
                    <div className="flex items-center gap-2 mb-2 px-2">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{m.senderName}</span>
                       <span className="text-[10px] text-white/20 font-bold">{formatTime(m.timestamp)}</span>
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[70%] p-4 sm:p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-lg ${
                      m.senderId === user?.id 
                      ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                      : "bg-white/10 text-white border border-white/10 rounded-tl-none"
                    }`}>
                      {m.text}
                      {m.fileUrl && (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                          {m.fileUrl.match(/\.(mp4|webm|ogg|mov)$|video/i) ? (
                            <video 
                              src={m.fileUrl} 
                              controls 
                              className="max-h-80 w-full object-contain"
                              poster="/video-placeholder.png"
                            />
                          ) : m.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$|image/i) ? (
                            <img 
                              src={m.fileUrl} 
                              alt="添付画像" 
                              className="max-h-80 w-full object-contain cursor-pointer"
                              onClick={() => window.open(m.fileUrl, '_blank')}
                            />
                          ) : (
                            <a 
                              href={m.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                            >
                              <div className="p-2 bg-white/10 rounded-lg">
                                <FileIcon size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold truncate">添付ファイルを表示</div>
                                <div className="text-[10px] text-white/40">クリックして開く</div>
                              </div>
                              <Download size={16} className="text-white/40" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white/5 border-t border-white/10 relative z-20">
              <div className="flex gap-3 items-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="video/*,image/*,.pdf,.zip"
                  />
                  <button 
                    onClick={handleFileClick}
                    disabled={isUploading}
                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white border border-white/5 active:scale-90 disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Paperclip size={24} />}
                  </button>
                 <div className="flex-1 relative">
                   <input 
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === "Enter" && handleSend()}
                      placeholder="メッセージを入力してください..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex-1 outline-none px-6 focus:ring-2 focus:ring-primary/50 text-white font-medium transition-all shadow-inner backdrop-blur-md"
                   />
                 </div>
                 <button 
                   onClick={handleSend}
                   disabled={!inputText.trim()}
                   className={`w-14 h-14 bg-primary text-white rounded-2xl items-center justify-center flex transition-all shadow-xl shadow-primary/20 ${!inputText.trim() ? "opacity-30 grayscale cursor-not-allowed" : "hover:scale-105 active:scale-95 glow-effect"}`}
                 >
                    <Send size={24} />
                 </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </ClientOnly>
  );
}

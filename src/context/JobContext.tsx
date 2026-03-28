"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  fileUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  mainCharacter: string;
  sentences: string;
  duration: 60 | 120; // seconds
  price: number;
  reward: number;
  requests: { [key: string]: string };
  requestorId: string;
  requestorName: string;
  providerId?: string;
  providerName?: string;
  status: "pending" | "ongoing" | "delivered" | "completed" | "cancelled";
  createdAt: string;
  messages: Message[];
}

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  addJob: (job: Omit<Job, "id" | "status" | "createdAt" | "messages">) => Promise<void>;
  acceptJob: (jobId: string, providerId: string, providerName: string) => Promise<void>;
  updateJobStatus: (jobId: string, status: Job["status"]) => Promise<void>;
  sendMessage: (jobId: string, senderId: string, senderName: string, text: string, fileUrl?: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 初期データ取得
  useEffect(() => {
    const fetchJobs = async () => {
      // 案件とそれに紐づく全メッセージを取得
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          messages (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
      } else if (jobsData) {
        setJobs(jobsData.map(mapJobData));
      }
      setLoading(false);
    };

    fetchJobs();

    // 2. リアルタイム購読 (案件の更新)
    const jobsChannel = supabase.channel('jobs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const newJob = mapJobData(payload.new);
          setJobs(prev => [newJob, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          // メッセージを保持したまま更新するために、既存の状態をマージ
          setJobs(prev => prev.map(job => 
            job.id === (payload.new as any).id ? { ...job, ...mapJobData(payload.new), messages: job.messages } : job
          ));
        }
      })
      .subscribe();

    // 3. リアルタイム購読 (メッセージの更新)
    const messagesChannel = supabase.channel('messages_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage: Message = {
          id: (payload.new as any).id,
          senderId: (payload.new as any).sender_id,
          senderName: (payload.new as any).sender_name,
          text: (payload.new as any).text,
          timestamp: (payload.new as any).created_at,
          fileUrl: (payload.new as any).file_url
        };
        
        setJobs(prev => prev.map(job => 
          job.id === (payload.new as any).job_id 
          ? { ...job, messages: [...job.messages, newMessage] } 
          : job
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const mapJobData = (data: any): Job => ({
    id: data.id,
    title: data.title,
    mainCharacter: data.main_character,
    sentences: data.sentences,
    duration: data.duration,
    price: data.price,
    reward: data.reward,
    requests: data.requests || {},
    status: data.status,
    requestorId: data.requestor_id,
    requestorName: data.requestor_name,
    providerId: data.provider_id,
    providerName: data.provider_name,
    createdAt: data.created_at,
    messages: (data.messages || []).map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      text: m.text,
      timestamp: m.created_at,
      fileUrl: m.file_url
    }))
  });

  const addJob = async (jobData: Omit<Job, "id" | "status" | "createdAt" | "messages">) => {
    const { error } = await supabase
      .from('jobs')
      .insert([{
        title: jobData.title,
        main_character: jobData.mainCharacter,
        sentences: jobData.sentences,
        duration: jobData.duration,
        price: jobData.price,
        reward: jobData.reward,
        requests: jobData.requests,
        requestor_id: jobData.requestorId,
        requestor_name: jobData.requestorName,
        status: 'pending'
      }]);

    if (error) throw error;
  };

  const acceptJob = async (jobId: string, providerId: string, providerName: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'ongoing', 
        provider_id: providerId, 
        provider_name: providerName 
      })
      .eq('id', jobId);

    if (error) throw error;
  };

  const updateJobStatus = async (jobId: string, status: Job["status"]) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', jobId);

    if (error) throw error;
  };

  const sendMessage = async (jobId: string, senderId: string, senderName: string, text: string, fileUrl?: string) => {
    const { error } = await supabase
      .from('messages')
      .insert([{
        job_id: jobId,
        sender_id: senderId,
        sender_name: senderName,
        text,
        file_url: fileUrl
      }]);

    if (error) throw error;
  };

  return (
    <JobContext.Provider value={{ jobs, loading, addJob, acceptJob, updateJobStatus, sendMessage }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
}

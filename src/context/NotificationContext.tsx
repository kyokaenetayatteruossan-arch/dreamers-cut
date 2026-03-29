"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (userId: string, type: string, title: string, content: string, link?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const isSubscribed = useRef(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    // 初期データの取得
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching notifications:", error);
      } else if (data) {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();

    // リアルタイム購読
    if (!isSubscribed.current) {
      const channel = supabase.channel(`public:notifications:user_id=eq.${user.id}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log("New Notification Received:", payload.new);
            setNotifications(prev => [payload.new as AppNotification, ...prev]);
            
            // ブラウザ通知 (もしユーザーが許可していれば)
            if (globalThis.Notification && globalThis.Notification.permission === "granted") {
              new globalThis.Notification(payload.new.title, { body: payload.new.content });
            }
          }
        )
        .subscribe();

      isSubscribed.current = true;
      return () => {
        supabase.removeChannel(channel);
        isSubscribed.current = false;
      };
    }
  }, [user?.id]); // idを監視して確実に再購読

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const addNotification = async (userId: string, type: string, title: string, content: string, link?: string) => {
    const { error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, type, title, content, link }]);
    
    if (error) console.error("Failed to add notification:", error);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

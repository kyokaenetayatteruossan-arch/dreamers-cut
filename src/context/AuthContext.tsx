"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  likes: number;
  penaltyPoints: number;
  crown: "none" | "silver" | "gold";
  hasPassedTraining: boolean;
  achievements: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  passTest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 現在の認証状態を確認し、プロファイルを同期する
    const initializeAuth = async () => {
      try {
        console.log("Initializing Auth...");
        // getSession() は高速だが、Lock競合のリスクがあるため慎重に扱う
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn("Session fetch error (expected if locked):", sessionError.message);
          // 失敗しても onAuthStateChange が後で面倒を見てくれる
        }

        if (session?.user) {
          if (mounted) await fetchProfile(session.user);
        } else {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (err: any) {
        console.error("Auth init fatal error:", err);
        if (mounted) setLoading(false);
      }
    };

    // 1. まず初期化を実行
    initializeAuth();

    // 2. 状態変化を監視（こちらが「真実」のソース）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event Notification:", event, session?.user?.id);
      
      // SIGNED_IN, INITIAL_SESSION, TOKEN_REFRESHED などのイベントを処理
      if (session?.user) {
        if (mounted) await fetchProfile(session.user);
      } else {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 重複フェッチを防ぐための簡易ロック
  let isFetchingProfile = false;

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    if (isFetchingProfile) return;
    isFetchingProfile = true;

    try {
      console.log("Fetching profile for:", supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log("Creating new profile...");
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: supabaseUser.id,
              name: supabaseUser.user_metadata.full_name || supabaseUser.email?.split('@')[0] || "ゲスト",
              email: supabaseUser.email,
              avatar_url: supabaseUser.user_metadata.avatar_url,
              points: 50,
              likes: 0,
              penalty_points: 0,
              achievements: 0,
              crown: 'none',
              has_passed_training: false
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        
        if (newProfile) {
          setUser({
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            avatar: newProfile.avatar_url,
            points: newProfile.points,
            likes: newProfile.likes,
            penaltyPoints: newProfile.penalty_points,
            crown: newProfile.crown as "none" | "silver" | "gold",
            hasPassedTraining: newProfile.has_passed_training,
            achievements: newProfile.achievements
          });
        }
      } else if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar_url,
          points: profile.points,
          likes: profile.likes,
          penaltyPoints: profile.penalty_points,
          crown: profile.crown as "none" | "silver" | "gold",
          hasPassedTraining: profile.has_passed_training,
          achievements: profile.achievements
        });
      }
    } catch (e) {
      console.error("Profile fetch error:", e);
    } finally {
      isFetchingProfile = false;
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    if (error) throw error;
    // Note: fetchProfile will be triggered by onAuthStateChange
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Note: fetchProfile will be triggered by onAuthStateChange
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    // UIを即座に更新（楽観的アップデート）
    const nextUser = { ...user, ...updates };
    
    // ランク計算
    if (nextUser.likes >= 500) nextUser.crown = "gold";
    else if (nextUser.likes >= 100) nextUser.crown = "silver";
    else nextUser.crown = "none";
    
    setUser(nextUser);

    // データベースを更新
    const { error } = await supabase
      .from('profiles')
      .update({
        name: nextUser.name,
        points: nextUser.points,
        likes: nextUser.likes,
        penalty_points: nextUser.penaltyPoints,
        achievements: nextUser.achievements,
        crown: nextUser.crown,
        has_passed_training: nextUser.hasPassedTraining,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error("Failed to update profile in DB:", error);
      // 失敗した場合は再取得して同期
      await fetchProfile({ id: user.id } as SupabaseUser);
    }
  };

  const passTest = async () => {
    await updateUser({ hasPassedTraining: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUp, signIn, logout, updateUser, passTest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

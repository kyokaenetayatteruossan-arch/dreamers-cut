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
    // 1. 現在のセッションを確認
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Changed:", event, session?.user?.id);
      
      // SIGNED_INイベントはログイン時だけでなく、アプリ起動時(初期化後)にも発生することがある
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log("Fetching profile for:", supabaseUser.id);
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log("Profile not found, creating one...");
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
        profile = newProfile;
      }

      if (profile) {
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
      console.error("Error fetching profile:", e);
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

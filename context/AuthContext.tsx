import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

const mockUser: User = {
  id: 'mock-user-123',
  name: 'مستخدم تجريبي',
  email: 'mock@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=mock-user',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name || supabaseUser.email!,
      email: supabaseUser.email!,
      avatarUrl: supabaseUser.user_metadata.avatar_url || supabaseUser.user_metadata.picture,
    };
  };

  const handleUserSignIn = async (session: Session) => {
    if (!supabase) return;
    try {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                google_id: session.user.user_metadata?.sub,
                last_sign_in: new Date().toISOString(),
            }, {
                onConflict: 'id',
            });

        if (error) {
            console.error('Error upserting user data:', error);
            throw error;
        }
    } catch (error) {
        console.error("Failed to sync user profile:", error);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser(mapSupabaseUserToAppUser(session.user));
        }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user;
        if (_event === 'SIGNED_IN' && session) {
            handleUserSignIn(session);
            setUser(mapSupabaseUserToAppUser(currentUser!));
        } else if (_event === 'SIGNED_OUT') {
            setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    if (isSupabaseConfigured && supabase) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.search = '';
        cleanUrl.hash = '';
        const redirectUrl = cleanUrl.toString();
        
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl,
              queryParams: {
                prompt: 'select_account'
              }
            }
        });
    } else {
      console.warn('Supabase not configured. Using mock user.');
      setUser(mockUser);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
        setUser(null);
    } else {
      console.warn('Supabase not configured. Clearing mock user.');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
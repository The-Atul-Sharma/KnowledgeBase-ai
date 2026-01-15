"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser((prevUser) => {
        if (prevUser?.id !== user?.id) {
          return user;
        }
        return prevUser;
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading((prevLoading) => {
        if (prevLoading) {
          return false;
        }
        return prevLoading;
      });
    }
  }, []);

  useEffect(() => {
    checkUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user || null;
      setUser((prevUser) => {
        if (prevUser?.id !== newUser?.id) {
          return newUser;
        }
        return prevUser;
      });
      setLoading((prevLoading) => {
        if (prevLoading) {
          return false;
        }
        return prevLoading;
      });
    });

    return () => subscription.unsubscribe();
  }, [checkUser]);

  return { user, loading };
}


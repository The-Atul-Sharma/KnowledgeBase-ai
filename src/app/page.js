"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import KeyFeatures from "@/components/KeyFeatures";
import CTASection from "@/components/CTASection";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        showAuth={true}
        user={user}
        loading={loading}
        onLogout={handleLogout}
      />

      <main>
        <HeroSection loading={loading} user={user} />
        <FeaturesSection />
        <KeyFeatures />
        <CTASection loading={loading} user={user} />
      </main>
    </div>
  );
}

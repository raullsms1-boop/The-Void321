/*
 * AuthGate — Requires user to be signed in before accessing content.
 * Shows a cinematic sign-in prompt if not authenticated.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { LogIn, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AuthGateProps {
  children: React.ReactNode;
  /** Message shown to unauthenticated users */
  message?: string;
}

export default function AuthGate({ children, message }: AuthGateProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-crimson animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-crimson/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-crimson" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
            Sign In Required
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {message || "You need to sign in with your email to access this content. This helps us keep The Void safe by identifying and banning users who violate our community policies."}
          </p>
          <Button
            onClick={() => { window.location.href = getLoginUrl(); }}
            className="bg-crimson hover:bg-crimson-light text-white px-6 py-3 text-base font-medium w-full flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In / Sign Up
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Free to join &middot; No credit card required
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

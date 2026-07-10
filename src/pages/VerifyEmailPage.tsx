import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Mail, RefreshCw, LogOut, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export function VerifyEmailPage() {
  const { currentUser, signOut } = useContext(AuthContext);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle countdown timer for Resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user || cooldown > 0) return;
    setIsResending(true);
    setMessage(null);
    try {
      await sendEmailVerification(user);
      setMessage({ type: "success", text: "Verification link resent successfully! Please check your inbox." });
      setCooldown(60); // 60-second cooldown
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to resend verification email. Please try again later." });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setIsChecking(true);
    setMessage(null);
    try {
      // Reload user data from Firebase to get latest status
      await user.reload();
      if (user.emailVerified) {
        // If verified, reload page to trigger App rerender
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: "We couldn't confirm your verification. Please click the link in your email first, then click check status again."
        });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to verify email status." });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
          <Mail className="h-8 w-8 animate-bounce" />
        </div>

        <h2 className="text-2xl font-display font-bold text-navy tracking-tight mb-2">
          Verify your email
        </h2>
        
        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
          We sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to activate your account.
        </p>

        {currentUser?.email && (
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">Recipient Address</span>
            <span className="text-sm font-bold text-navy break-all">{currentUser.email}</span>
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 text-left mb-6 text-sm ${
            message.type === "success" 
              ? "bg-emerald-50 border border-emerald-100 text-emerald-800" 
              : "bg-red-50 border border-red-100 text-red-800"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={handleCheckVerification} 
            disabled={isChecking}
            className="w-full justify-center gap-2"
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Check Status
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending || cooldown > 0}
              variant="outline"
              className="flex-1 justify-center text-xs font-semibold"
            >
              {isResending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : null}
              {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend Link"}
            </Button>

            <Button
              onClick={signOut}
              variant="outline"
              className="flex-1 justify-center text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

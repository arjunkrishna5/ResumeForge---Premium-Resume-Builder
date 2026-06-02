import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { FileText, Mail, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Analytics } from "../lib/analytics";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useContext(AuthContext);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password);
        Analytics.userSignedUp('email');
      }
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect password. Try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try logging in.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Check your connection.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('This sign-in method is not enabled. Please contact support.');
      } else {
        setError(err.message || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      if (!isLogin) {
        Analytics.userSignedUp('google');
      }
    } catch (err: any) {
      setError(err.message || 'Could not sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <Link 
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-navy transition-colors group z-20"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to home
      </Link>
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">ResumeForge</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          {isLogin ? 'Log in to access your resumes' : 'Start building your professional resume today'}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto w-full sm:max-w-md relative z-10 px-4 sm:px-0"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100">
              <span className="font-bold text-lg text-primary">G</span>
            </div>
            Sign in with Google
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with email</span>
              </div>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[3px] focus:ring-primary/10 transition-shadow focus:border-primary sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[3px] focus:ring-primary/10 transition-shadow focus:border-primary sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[3px] focus:ring-primary/10 transition-shadow focus:border-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 flex items-start gap-3 border border-red-100">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Create account')}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

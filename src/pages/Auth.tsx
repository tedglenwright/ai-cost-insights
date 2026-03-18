import { useState } from "react";
import { login, signup, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_URL || 'https://aioptimizer-production.up.railway.app/api';

type View = "login" | "signup" | "forgot" | "resetSent";

interface AuthProps {
  onAuth: () => void;
}

export function Auth({ onAuth }: AuthProps) {
  const [view, setView] = useState<View>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      setToken(data.token);
      onAuth();
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const data = await signup(name, email, password);
      setToken(data.token);
      onAuth();
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      setView("resetSent");
    } catch (err) {
      setError("Failed to send reset email");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E3A5F]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#1A2440] shadow-2xl border border-white/10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">💰</div>
          <h1 className="text-2xl font-bold text-white">AIOptimizer</h1>
          <p className="text-sm text-slate-400 mt-1">Monitor & optimize your AI API costs</p>
        </div>

        {/* Tabs (login/signup only) */}
        {(view === "login" || view === "signup") && (
          <div className="flex mb-6 bg-[#0F172A] rounded-lg p-1">
            <button
              onClick={() => { setView("login"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${view === "login" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
            >Login</button>
            <button
              onClick={() => { setView("signup"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${view === "signup" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
            >Sign Up</button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-[#0F172A] border-white/10 text-white placeholder:text-slate-600"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-[#0F172A] border-white/10 text-white"
                required
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setView("forgot"); setError(""); setResetEmail(email); }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}

        {/* Signup Form */}
        {view === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-[#0F172A] border-white/10 text-white placeholder:text-slate-600"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-[#0F172A] border-white/10 text-white placeholder:text-slate-600"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Password</label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-[#0F172A] border-white/10 text-white"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-xs text-slate-500 text-center">
              By signing up you agree to our Terms of Service
            </p>
          </form>
        )}

        {/* Forgot Password */}
        {view === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-white">Reset Password</h2>
              <p className="text-sm text-slate-400 mt-1">Enter your email and we'll send a reset link</p>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="bg-[#0F172A] border-white/10 text-white placeholder:text-slate-600"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <button
              type="button"
              onClick={() => { setView("login"); setError(""); }}
              className="w-full text-sm text-slate-400 hover:text-white text-center"
            >
              ← Back to login
            </button>
          </form>
        )}

        {/* Reset Sent */}
        {view === "resetSent" && (
          <div className="text-center space-y-4">
            <div className="text-5xl">📧</div>
            <h2 className="text-lg font-semibold text-white">Check your email</h2>
            <p className="text-sm text-slate-400">
              If <span className="text-white">{resetEmail}</span> exists in our system,
              you'll receive a password reset link shortly.
            </p>
            <Button
              onClick={() => { setView("login"); setError(""); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Back to login
            </Button>
          </div>
        )}

        {/* Benefits */}
        {(view === "login" || view === "signup") && (
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: "📊", label: "Real-time spend" },
              { icon: "💡", label: "Smart savings" },
              { icon: "🚨", label: "Budget alerts" },
            ].map(({ icon, label }) => (
              <div key={label}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

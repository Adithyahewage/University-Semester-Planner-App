import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setMessage("Check your email for a confirmation link!");
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else setMessage("Signed in!");
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign Up / Sign In</h2>
      <form>
        <input
          className="w-full mb-2 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="flex-1 bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            onClick={handleSignIn}
            disabled={loading}
            type="button"
          >
            Sign In
          </button>
          <button
            className="flex-1 bg-green-600 text-white p-2 rounded disabled:opacity-50"
            onClick={handleSignUp}
            disabled={loading}
            type="button"
          >
            Sign Up
          </button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {message && <div className="text-green-600 mt-2">{message}</div>}
      </form>
    </div>
  );
}

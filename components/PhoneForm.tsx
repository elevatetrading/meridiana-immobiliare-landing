"use client";

import { useState } from "react";

export default function PhoneForm() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const digits = phone.replace(/[\s\-().+]/g, "");
    if (!digits) return;

    setLoading(true);
    setError("");

    try {
      const fullPhone = `+39${digits}`;
      const res = await fetch(
        "https://elevate-noleggio-pro.vercel.app/api/webhook/landing-contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: fullPhone,
            vertical: "immobiliare",
            source: "landing-meridiana",
          }),
        }
      );
      if (!res.ok) throw new Error("non-ok");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* Success state */
  if (done) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 px-6 bg-white rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.07)] border border-gray-100">
        <svg
          className="w-4 h-4 text-emerald-500 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
        <p className="text-[14px] font-medium text-gray-700">
          Got it. Our AI assistant will call you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex items-center bg-white rounded-full px-2 py-[7px] shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-gray-100/80">
        {/* Flag + prefix */}
        <div className="flex items-center gap-1.5 pl-3 pr-3 shrink-0">
          <span className="text-xl leading-none" aria-label="Italy">
            🇮🇹
          </span>
          <span className="text-[13px] font-medium text-gray-700">+39</span>
        </div>

        {/* Divider */}
        <span className="w-px h-5 bg-gray-200 shrink-0" aria-hidden="true" />

        {/* Input */}
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your phone number"
          autoComplete="tel-national"
          inputMode="tel"
          className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-gray-800 placeholder-gray-400 px-3 py-1"
          aria-label="Phone number"
        />

        {/* CTA Button */}
        <button
          type="submit"
          disabled={loading || phone.trim().length < 5}
          className="shrink-0 flex items-center gap-[6px] bg-[#333333] hover:bg-[#222222] active:bg-[#111111] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-full px-4 py-[10px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1"
          aria-label="Get called by our AI assistant"
        >
          {loading ? (
            /* Spinner */
            <svg
              className="w-4 h-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <>
              {/* Sparkle */}
              <svg
                className="w-3.5 h-3.5 shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0l1.5 5.5L15 7l-5.5 1.5L8 14l-1.5-5.5L1 7l5.5-1.5L8 0z" />
              </svg>
              <span className="hidden sm:inline">
                Get called by our AI assistant
              </span>
              <span className="sm:hidden">Get called</span>
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-[12px] mt-2 text-center" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

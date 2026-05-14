"use client";

import { useState, useRef } from "react";

type NumericStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type StepId = NumericStep | "phone";

interface Answers {
  tipo_operazione: "buy" | "rent" | "";
  tipo_immobile: string;
  zona_preferita: string;
  budget_max: string;
  urgenza: string;
  ha_immobile_da_vendere: string;
  mutuo_preapprovato: string;
}

interface QuizProps {
  onClose: () => void;
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-3.5 rounded-xl border text-[15px] font-medium transition-all duration-150 ${
        selected
          ? "border-violet-400 bg-violet-50 text-violet-700 shadow-[0_0_0_3px_rgba(167,139,250,0.15)]"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/80"
      }`}
    >
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0l1.5 5.5L15 7l-5.5 1.5L8 14l-1.5-5.5L1 7l5.5-1.5L8 0z" />
    </svg>
  );
}

export default function Quiz({ onClose }: QuizProps) {
  const [step, setStep] = useState<StepId>(1);
  const dirRef = useRef<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);

  const [answers, setAnswers] = useState<Answers>({
    tipo_operazione: "",
    tipo_immobile: "",
    zona_preferita: "",
    budget_max: "",
    urgenza: "",
    ha_immobile_da_vendere: "",
    mutuo_preapprovato: "",
  });
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [calls, setCalls] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const isBuy = answers.tipo_operazione === "buy";

  const stepSequence: StepId[] = isBuy
    ? [1, 2, 3, 4, 5, 6, 7, "phone"]
    : [1, 2, 3, 4, 5, 6, "phone"];

  const currentIdx = stepSequence.indexOf(step);
  const progress = done ? 100 : ((currentIdx + 1) / stepSequence.length) * 100;

  function navigate(nextStep: StepId, direction: "forward" | "back") {
    dirRef.current = direction;
    setStep(nextStep);
    setAnimKey((k) => k + 1);
  }

  function goNext(override?: StepId) {
    const idx = stepSequence.indexOf(step);
    const next = override ?? stepSequence[idx + 1];
    if (next !== undefined) navigate(next, "forward");
  }

  function goPrev() {
    const idx = stepSequence.indexOf(step);
    if (idx === 0) { onClose(); return; }
    navigate(stepSequence[idx - 1], "back");
  }

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/[\s\-().+]/g, "");
    if (digits.length < 9) return;
    if (!privacy) {
      setError("Please accept the privacy policy to continue.");
      return;
    }

    setLoading(true);
    setError("");

    const body: Record<string, string> = {
      phone: `+39${digits}`,
      vertical: "immobiliare",
      source: "landing-meridiana-quiz",
      tipo_operazione: answers.tipo_operazione,
      tipo_immobile: answers.tipo_immobile,
      zona_preferita: answers.zona_preferita,
      budget_max: answers.budget_max,
      urgenza: answers.urgenza,
      ha_immobile_da_vendere: answers.ha_immobile_da_vendere,
    };

    if (isBuy && answers.mutuo_preapprovato) {
      body.mutuo_preapprovato = answers.mutuo_preapprovato;
    }

    try {
      const res = await fetch(
        "https://elevate-noleggio-pro.vercel.app/api/webhook/landing-contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("non-ok");
      setDone(true);
      setAnimKey((k) => k + 1);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const buyBudgets = [
    { label: "< €100k", value: "lt_100k" },
    { label: "€100k – 200k", value: "100k_200k" },
    { label: "€200k – 350k", value: "200k_350k" },
    { label: "> €350k", value: "gt_350k" },
  ];
  const rentBudgets = [
    { label: "< €500/mo", value: "lt_500" },
    { label: "€500 – 800/mo", value: "500_800" },
    { label: "€800 – 1,200/mo", value: "800_1200" },
    { label: "> €1,200/mo", value: "gt_1200" },
  ];

  const animClass =
    dirRef.current === "forward" ? "quiz-enter-forward" : "quiz-enter-back";

  function renderContent() {
    if (done) {
      return (
        <div className="text-center max-w-sm mx-auto py-8">
          <div
            className="text-6xl mb-6 select-none"
            style={{ filter: "drop-shadow(0 8px 24px rgba(109,40,217,0.25))" }}
          >
            🏠
          </div>
          <h2 className="text-[26px] font-bold text-gray-900 mb-3 tracking-tight">
            Thank you!
          </h2>
          <p className="text-gray-500 leading-relaxed text-[15px]">
            We&apos;ll text you in a few seconds with your first questions.
          </p>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <StepShell question="Are you looking to buy or rent?">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Buy 🏡", value: "buy" as const },
                { label: "Rent 🔑", value: "rent" as const },
              ].map((o) => (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  selected={answers.tipo_operazione === o.value}
                  onClick={() => {
                    set("tipo_operazione", o.value);
                    set("budget_max", "");
                    setTimeout(() => goNext(2), 120);
                  }}
                />
              ))}
            </div>
          </StepShell>
        );

      case 2:
        return (
          <StepShell question="What type of property are you looking for?">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Apartment", value: "apartment" },
                { label: "Villa", value: "villa" },
                { label: "Commercial space", value: "commercial" },
                { label: "Other", value: "other" },
              ].map((o) => (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  selected={answers.tipo_immobile === o.value}
                  onClick={() => {
                    set("tipo_immobile", o.value);
                    setTimeout(() => goNext(), 120);
                  }}
                />
              ))}
            </div>
          </StepShell>
        );

      case 3:
        return (
          <StepShell question="Which area in Palermo do you prefer?">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (answers.zona_preferita.trim()) goNext();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={answers.zona_preferita}
                onChange={(e) => set("zona_preferita", e.target.value)}
                placeholder="e.g. Mondello, Centro, Brancaccio"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white text-[15px] text-gray-800 placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                autoFocus
              />
              <NextButton disabled={!answers.zona_preferita.trim()} />
            </form>
          </StepShell>
        );

      case 4: {
        const budgets = isBuy ? buyBudgets : rentBudgets;
        return (
          <StepShell question="What's your approximate budget?">
            <div className="grid grid-cols-2 gap-3">
              {budgets.map((o) => (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  selected={answers.budget_max === o.value}
                  onClick={() => {
                    set("budget_max", o.value);
                    setTimeout(() => goNext(), 120);
                  }}
                />
              ))}
            </div>
          </StepShell>
        );
      }

      case 5:
        return (
          <StepShell question="How soon do you want to find it?">
            <div className="flex flex-col gap-3">
              {[
                { label: "Within 1 month", value: "1_month" },
                { label: "Within 3 months", value: "3_months" },
                { label: "Within 6 months", value: "6_months" },
                { label: "Just exploring", value: "exploring" },
              ].map((o) => (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  selected={answers.urgenza === o.value}
                  onClick={() => {
                    set("urgenza", o.value);
                    setTimeout(() => goNext(), 120);
                  }}
                />
              ))}
            </div>
          </StepShell>
        );

      case 6:
        return (
          <StepShell question="Do you have a property to sell or rent out?">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
                { label: "Maybe", value: "maybe" },
              ].map((o) => (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  selected={answers.ha_immobile_da_vendere === o.value}
                  onClick={() => {
                    set("ha_immobile_da_vendere", o.value);
                    setTimeout(() => goNext(), 120);
                  }}
                />
              ))}
            </div>
          </StepShell>
        );

      case 7:
        return (
          <StepShell question="Have you spoken with a bank about a mortgage?">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
                { label: "In progress", value: "in_progress" },
              ].map((o) => (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  selected={answers.mutuo_preapprovato === o.value}
                  onClick={() => {
                    set("mutuo_preapprovato", o.value);
                    setTimeout(() => goNext(), 120);
                  }}
                />
              ))}
            </div>
          </StepShell>
        );

      case "phone":
        return (
          <StepShell question="Almost there — where should we send your matches?">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="flex items-center bg-white rounded-full px-4 py-3 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <span className="text-xl mr-2 select-none" aria-label="Italy">🇮🇹</span>
                <span className="text-[13px] font-medium text-gray-700 mr-3">+39</span>
                <span className="w-px h-5 bg-gray-200 mr-3 shrink-0" aria-hidden="true" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  inputMode="tel"
                  autoComplete="tel-national"
                  autoFocus
                  className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-gray-800 placeholder-gray-400"
                  aria-label="Phone number"
                />
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { id: "privacy", label: "I accept the Privacy Policy", required: true, val: privacy, setter: setPrivacy },
                  { id: "marketing", label: "I accept marketing communications", required: false, val: marketing, setter: setMarketing },
                  { id: "calls", label: "I accept to be contacted by phone", required: false, val: calls, setter: setCalls },
                ].map((c) => (
                  <label key={c.id} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id={c.id}
                      checked={c.val}
                      onChange={(e) => c.setter(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-violet-500 cursor-pointer shrink-0"
                    />
                    <span className="text-[12px] text-gray-500 leading-snug group-hover:text-gray-700 transition-colors">
                      {c.label}
                      {c.required && <span className="text-red-400 ml-0.5">*</span>}
                    </span>
                  </label>
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-[12px]" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || phone.replace(/[\s\-().+]/g, "").length < 9}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#333333] hover:bg-[#222222] text-white text-[14px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <Spinner /> : <><Sparkle /> Get my matches</>}
              </button>
            </form>
          </StepShell>
        );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#FAFAF7] flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Property quiz"
    >
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100/80 shrink-0">
        {!done && (
          <button
            onClick={goPrev}
            className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-800 transition-colors shrink-0"
            aria-label="Go back"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-400 rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          aria-label="Close quiz"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-10">
        <div
          key={animKey}
          className={`w-full max-w-md ${animClass}`}
        >
          {renderContent()}
        </div>
      </div>

      {/* Footer brand */}
      <div className="py-3 text-center shrink-0">
        <span className="text-[11px] text-gray-300 tracking-wide select-none">
          Meridiana Immobiliare
        </span>
      </div>
    </div>
  );
}

function StepShell({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h2 className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-snug tracking-tight">
        {question}
      </h2>
      {children}
    </div>
  );
}

function NextButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-3.5 rounded-full bg-[#333333] hover:bg-[#222222] text-white text-[14px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      Continue →
    </button>
  );
}

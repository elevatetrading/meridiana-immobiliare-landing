import PhoneForm from "@/components/PhoneForm";

export default function Home() {
  return (
    <>
      {/* ─── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="w-full px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <span className="flex items-center gap-2 text-[13px] font-semibold tracking-tight">
            <span
              className="w-2 h-2 rounded-full bg-violet-500 inline-block shrink-0"
              aria-hidden="true"
            />
            Meridiana Immobiliare
          </span>

          {/* Info — desktop only */}
          <div className="hidden sm:flex items-center gap-6 text-[13px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
                aria-hidden="true"
              />
              MON–SAT&nbsp;9–19
            </span>
            <a
              href="tel:+390000000000"
              className="text-[#111111] font-medium hover:underline underline-offset-2"
            >
              +39&nbsp;000&nbsp;000&nbsp;0000
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Main content ─────────────────────────────────────────────────── */}
      <main className="flex flex-col items-center text-center px-6 pt-4 pb-24">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 border border-gray-200/70 rounded-full px-4 py-[7px] mb-10 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <span
            className="w-[7px] h-[7px] rounded-full bg-violet-400 shrink-0"
            aria-hidden="true"
          />
          <span className="text-[11px] font-semibold tracking-[0.13em] text-gray-500 uppercase">
            Real Estate AI-Powered
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-bold leading-[1.06] tracking-[-0.03em] text-[#111111] max-w-[750px] mb-5"
          style={{ fontSize: "clamp(2.6rem, 7.5vw, 5.2rem)" }}
        >
          Your home in Palermo,{" "}
          <br className="hidden sm:block" />
          in{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10">60 seconds</span>
            <span
              className="absolute inset-0 -inset-x-2 bg-violet-100 rounded-[10px]"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-gray-500 max-w-[420px] leading-relaxed mb-14"
          style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.125rem)" }}
        >
          Answer a few quick questions and Meridiana&apos;s AI assistant
          matches you with the right property, in real time.
        </p>

        {/* Hero visual */}
        <div
          className="relative flex items-center justify-center mb-14"
          style={{ width: 240, height: 240 }}
          aria-hidden="true"
        >
          {/* Glow halo */}
          <span className="absolute inset-[30px] rounded-full bg-violet-100 blur-3xl opacity-70" />

          {/*
            Replace this emoji with your 3D keys render:
            → Save PNG to /public/images/keys-3d.png
            → Then swap this <span> for:
               <Image src="/images/keys-3d.png" alt="Keys" width={220} height={220}
                      className="relative drop-shadow-2xl" priority />
          */}
          <span
            className="relative select-none"
            style={{
              fontSize: "7.5rem",
              lineHeight: 1,
              filter:
                "drop-shadow(0 24px 48px rgba(109,40,217,0.20)) drop-shadow(0 6px 16px rgba(0,0,0,0.07))",
            }}
          >
            🗝️
          </span>
        </div>

        {/* Phone form */}
        <div className="w-full max-w-[530px] mb-5">
          <PhoneForm />
        </div>

        {/* Secondary CTA */}
        {/* TODO: replace href="#" with the actual GHL form URL when available */}
        <a
          href="#"
          className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          Prefer a quick quiz?&nbsp;→
        </a>
      </main>
    </>
  );
}

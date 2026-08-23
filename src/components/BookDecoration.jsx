import { motion } from 'framer-motion';

export default function BookDecoration() {
  return (
    <>
      {/* ── Left Notebook Binding Margin (Desktop & Tablet) ── */}
      <div
        className="fixed top-0 bottom-0 left-0 w-3 md:w-5 pointer-events-none z-30 hidden sm:block"
        style={{
          background: 'linear-gradient(to right, rgba(90, 60, 30, 0.15) 0%, rgba(90, 60, 30, 0.05) 50%, transparent 100%)',
          borderRight: '1px dashed rgba(160, 130, 90, 0.3)',
        }}
        aria-hidden="true"
      />

      {/* ── Vintage Coffee Stain Accent (Bottom Left) ── */}
      <div
        className="fixed bottom-6 left-6 pointer-events-none opacity-20 z-0 hidden lg:block"
        aria-hidden="true"
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#8B5A2B"
            strokeWidth="3.5"
            strokeDasharray="18 4 8 3"
            opacity="0.5"
          />
          <circle
            cx="52"
            cy="48"
            r="38"
            stroke="#8B5A2B"
            strokeWidth="1.5"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* ── Journal Page Stamp Footer ── */}
      <footer className="mt-12 mb-8 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">
        <div className="flex items-center gap-3 opacity-40">
          <div className="h-px w-12 sm:w-20 bg-zinc-400" />
          <p className="font-handwritten text-xs sm:text-sm tracking-widest text-zinc-600 uppercase font-semibold">
            • PAG. 01 • FE FTI SHARED HORIZON • VOL. 2026 •
          </p>
          <div className="h-px w-12 sm:w-20 bg-zinc-400" />
        </div>
        <span className="font-handwritten text-[10px] text-zinc-400 mt-1 opacity-50">
          written with love & memories
        </span>
      </footer>
    </>
  );
}

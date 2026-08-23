import { useState } from 'react';
import { motion } from 'framer-motion';
import { MemberSlot } from './MemberCircles';
import MemberDetailModal from './MemberDetailModal';

// ── Inline SVG Scrapbook Doodles & Accents ─────────────────────────────
const Doodle = ({ children, className }) => (
  <div className={`doodle ${className}`} aria-hidden="true">{children}</div>
);

const SpiralDoodle = ({ className }) => (
  <Doodle className={className}>
    <svg width="44" height="44" viewBox="0 0 50 50" fill="none">
      <path d="M25 25 C25 20 30 18 32 22 C34 26 28 32 22 30 C16 28 14 20 20 16 C26 12 36 16 36 25 C36 34 26 40 18 36 C10 32 8 20 16 12" stroke="#8b7355" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  </Doodle>
);

const StarDoodle = ({ className }) => (
  <Doodle className={className}>
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <path d="M20 2 L22 16 L36 14 L24 20 L32 34 L20 24 L8 34 L16 20 L4 14 L18 16 Z" stroke="#8b7355" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  </Doodle>
);

const WaveDoodle = ({ className }) => (
  <Doodle className={className}>
    <svg width="70" height="18" viewBox="0 0 70 18" fill="none">
      <path d="M2 10 C12 2 22 16 32 10 C42 4 52 16 68 10" stroke="#8b7355" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  </Doodle>
);

const PaperClip = ({ className }) => (
  <div className={`absolute pointer-events-none z-20 ${className}`} aria-hidden="true">
    <svg width="22" height="44" viewBox="0 0 24 48" fill="none">
      <path
        d="M6 14 V34 C6 39 10 43 15 43 C20 43 24 39 24 34 V10 C24 5 19 1 14 1 C9 1 4 5 4 10 V36"
        stroke="#9ca3af"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </div>
);

const PostalStamp = ({ className }) => (
  <div
    className={`absolute pointer-events-none z-10 p-2 bg-amber-50/90 border border-dashed border-amber-800/40 text-amber-900/70 shadow-sm flex flex-col items-center justify-center font-handwritten ${className}`}
    style={{
      maskImage: 'radial-gradient(circle, transparent 2px, black 3px)',
      maskSize: '10px 10px',
    }}
  >
    <span className="text-[9px] uppercase tracking-widest font-bold">FTI • 2026</span>
    <span className="text-xs font-bold leading-none my-0.5">ARCHIVE</span>
    <span className="text-[8px] opacity-70">★ FE HORIZON ★</span>
  </div>
);

const RubberStamp = ({ className }) => (
  <div
    className={`absolute pointer-events-none z-10 px-2.5 py-1 rounded-full border-2 border-dashed border-red-800/40 text-red-900/50 font-handwritten text-[10px] tracking-wider uppercase font-bold flex items-center gap-1 select-none ${className}`}
    style={{
      boxShadow: 'inset 0 0 4px rgba(180,50,50,0.1)',
    }}
  >
    <span>✦ OFFICIAL CREW ✦</span>
  </div>
);

const HeroTape = ({ className, color = '' }) => (
  <div className={`tape ${color} ${className}`} />
);

const ScribbleUnderline = () => (
  <svg width="200" height="12" viewBox="0 0 200 12" fill="none">
    <path
      d="M2 8 C30 2, 50 10, 80 6 C110 2, 130 10, 160 4 C175 2, 190 8, 198 5"
      stroke="#c4956a" strokeWidth="2" strokeLinecap="round" fill="none"
      strokeDasharray="4 4"
    />
  </svg>
);

// ── Per-row randomised rotations & y-offsets ────────────────────────────
const TOP_ROTATES  = [-7,  4, -5,  8];
const TOP_OFFSETS  = [ 8, -4, 10, -5];

const BOT_ROTATES  = [ 6, -7,  3, -5,  7];
const BOT_OFFSETS  = [-6,  8, -3,  9, -7];

// ── Hero ────────────────────────────────────────────────────────────────
export default function Hero({ members, onUpdateMember }) {
  const [selectedMember, setSelectedMember] = useState(null);

  const topMembers = members.slice(0, 4);
  const botMembers = members.slice(4, 9);

  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-4 flex flex-col items-center">
      {/* ── Vintage Scrapbook Background Accents ── */}
      <PostalStamp className="top-4 right-4 sm:right-12 rotate-[8deg] hidden sm:flex" />
      <RubberStamp className="top-24 left-3 sm:left-10 rotate-[-14deg]" />
      <PaperClip className="top-7 left-[26%] rotate-[-12deg]" />

      {/* ── TOP MEMBER ROW ── */}
      <motion.div
        className="flex justify-around items-end w-full max-w-lg mb-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {topMembers.map((m, i) => (
          <MemberSlot
            key={m.id}
            member={m}
            onClick={() => setSelectedMember(m)}
            rotate={TOP_ROTATES[i]}
            yOffset={TOP_OFFSETS[i]}
          />
        ))}
      </motion.div>

      {/* ── TITLE AREA ── */}
      <div className="relative z-10 flex flex-col items-center text-center my-2 max-w-md w-full px-2">
        {/* Tape strips placed at outer safe positions (NEVER covering text) */}
        <HeroTape className="absolute -top-6 -left-2 sm:-left-6 w-20 sm:w-24 rotate-[-10deg]" color="tape-pink" />
        <HeroTape className="absolute -bottom-4 -right-2 sm:-right-6 w-16 sm:w-20 rotate-[8deg]" color="tape-blue" />

        {/* Doodles */}
        <StarDoodle   className="absolute w-8 h-8 top-1 left-[2%] rotate-[12deg]" />
        <SpiralDoodle className="absolute w-9 h-9 bottom-1 right-[2%] rotate-[45deg]" />
        <WaveDoodle   className="absolute w-14 h-4 -bottom-3 left-[8%] rotate-[-4deg]" />

        {/* Clean Kicker text on its own vintage paper strip badge */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-2 relative inline-block px-3 py-0.5 rounded-sm bg-amber-100/60 border border-amber-300/40 shadow-xs"
        >
          <p className="font-handwritten text-xs sm:text-sm tracking-[0.24em] text-amber-900/80 uppercase font-semibold">
            ✦ FE FTI Shared Horizon ✦
          </p>
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="font-handwritten text-8xl md:text-9xl font-bold text-zinc-800 leading-none tracking-tight my-1"
          initial={{ opacity: 0, scale: 0.82, rotate: -3 }}
          animate={{ opacity: 1, scale: 1,  rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 150, damping: 15 }}
        >
          FETISH
        </motion.h1>

        {/* Scribble underline */}
        <motion.div
          className="mt-1"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <ScribbleUnderline />
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="mt-3 flex items-center justify-center gap-3 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-400/40" />
          <p className="font-handwritten text-xl md:text-2xl text-zinc-600 italic whitespace-nowrap">
            Piecing our stories under a shared horizon.
          </p>
          <div className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-400/40" />
        </motion.div>
      </div>

      {/* ── BOTTOM MEMBER ROW ── */}
      <motion.div
        className="flex justify-around items-start w-full max-w-lg mt-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {botMembers.map((m, i) => (
          <MemberSlot
            key={m.id}
            member={m}
            onClick={() => setSelectedMember(m)}
            rotate={BOT_ROTATES[i]}
            yOffset={BOT_OFFSETS[i]}
          />
        ))}
      </motion.div>

      {/* Decorative wave separator */}
      <motion.div
        className="mt-8 w-full max-w-xs opacity-35"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.35, scaleX: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        aria-hidden="true"
      >
        <svg width="100%" height="10" viewBox="0 0 300 10" preserveAspectRatio="none" fill="none">
          <path d="M0 5 C50 1 80 9 150 5 C220 1 260 9 300 5" stroke="#c4b89a" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* ── Member Zoom & Detail Lightbox Modal ── */}
      <MemberDetailModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onUpdateMember={async (updated) => {
          await onUpdateMember(updated);
          setSelectedMember(updated);
        }}
      />
    </section>
  );
}

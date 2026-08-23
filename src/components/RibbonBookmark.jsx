import { motion } from 'framer-motion';

export default function RibbonBookmark() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed top-0 right-4 sm:right-10 z-40 pointer-events-none">
      <motion.button
        onClick={scrollToTop}
        className="pointer-events-auto cursor-pointer relative group flex flex-col items-center focus:outline-none"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 180, damping: 14 }}
        whileHover={{ y: 8 }}
        whileTap={{ scale: 0.95 }}
        title="Pita Pembatas Buku (Klik untuk kembali ke atas)"
        aria-label="Kembali ke atas"
      >
        {/* Ribbon Body */}
        <div
          className="w-7 sm:w-8 h-24 sm:h-28 relative shadow-lg flex flex-col items-center pt-3"
          style={{
            background: 'linear-gradient(135deg, #8B1E2F 0%, #6E1423 50%, #4D0E19 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
            boxShadow: '2px 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {/* Subtle silk weave lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)',
            }}
          />

          {/* Gold Foil Accent text */}
          <span className="font-handwritten text-[10px] sm:text-[11px] text-amber-200/90 font-bold tracking-widest [writing-mode:vertical-rl] rotate-180 select-none">
            FETISH
          </span>

          {/* Golden star rivet on top */}
          <div className="absolute top-1.5 w-2 h-2 rounded-full bg-amber-300 shadow-xs border border-amber-500/60" />
        </div>
      </motion.button>
    </div>
  );
}

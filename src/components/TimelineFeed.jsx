import { AnimatePresence, motion } from 'framer-motion';
import PolaroidCard from './PolaroidCard';

export default function TimelineFeed({ memories, activeFilter, categories, onEdit, onAddComment }) {
  return (
    <section id="timeline-feed" className="px-3 sm:px-4 py-6">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-300/50 to-transparent" />
        <h2 className="font-handwritten text-xl text-zinc-400 whitespace-nowrap">
          Momen Kita
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-300/50 to-transparent" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {memories.length === 0 ? (
            <div className="text-center py-24">
              <motion.p
                className="font-handwritten text-3xl text-zinc-300"
                animate={{ rotate: [0, -2, 0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                belum ada momen...
              </motion.p>
              <p className="font-handwritten text-base text-zinc-300/60 mt-2">
                tekan + untuk menambah yang pertama
              </p>
            </div>
          ) : (
            <>
              {/* ── Unified masonry: 2-col mobile → 3-col md → 4-col xl ── */}
              <style>{`
                #masonry-grid { column-count: 2; column-gap: 0.625rem; }
                @media (min-width: 640px)  { #masonry-grid { column-count: 2; column-gap: 1rem; } }
                @media (min-width: 768px)  { #masonry-grid { column-count: 3; column-gap: 1.25rem; } }
                @media (min-width: 1024px) { #masonry-grid { column-count: 3; column-gap: 1.5rem; } }
                @media (min-width: 1280px) { #masonry-grid { column-count: 4; column-gap: 1.5rem; } }
              `}</style>
              <div id="masonry-grid">
                {memories.map((memory, index) => (
                  <div key={memory.id} className="break-inside-avoid mb-4 sm:mb-6 md:mb-8 masonry-item">
                    <PolaroidCard
                      memory={memory}
                      index={index}
                      onEdit={onEdit}
                      onAddComment={onAddComment}
                      categories={categories}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Maximize2 } from 'lucide-react';
import { tapeVariants, rotations, formatDate } from '../data/memories';
import FloatingComments from './FloatingComments';
import PhotoLightboxModal from './PhotoLightboxModal';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.75, y: 60, rotate: 0 },
  visible: (i) => ({
    opacity: 1, scale: 1, y: 0,
    rotate: rotations[i % rotations.length],
    transition: { type: 'spring', stiffness: 100, damping: 13, delay: i * 0.08 },
  }),
};

// Subtle badge tones — cycle by index so any category looks good
const badgePalette = [
  'bg-zinc-100 text-zinc-500 border-zinc-200',
  'bg-stone-100 text-stone-500 border-stone-200',
  'bg-slate-100 text-slate-500 border-slate-200',
  'bg-neutral-100 text-neutral-500 border-neutral-200',
];

export default function PolaroidCard({ memory, index, onEdit, onAddComment, categories }) {
  const tape = tapeVariants[index % tapeVariants.length];
  const [menuOpen, setMenuOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Look up category object by id
  const category = categories?.find((c) => c.id === memory.categoryId);
  const badgeStyle = badgePalette[index % badgePalette.length];

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen((v) => !v);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(memory);
  };

  return (
    <>
      <div className="relative" style={{ width: '100%' }}>
        <motion.article
          id={`memory-${memory.id}`}
          className="polaroid cursor-grab active:cursor-grabbing mx-auto group relative"
          style={{ width: '100%' }}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover={{
            scale: 1.03, rotate: 0,
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          }}
          viewport={{ once: true, margin: '-30px' }}
          drag
          dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
          whileDrag={{ scale: 1.04, rotate: 0, zIndex: 50, cursor: 'grabbing' }}
          aria-label={`Kenangan: ${memory.title}`}
        >
          {/* Masking Tape */}
          <div className={`${tape.className} ${tape.color}`} />

          {/* Three-dot menu */}
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={handleMenuClick}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-black/25 text-white backdrop-blur-sm transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/40"
              aria-label="Opsi"
            >
              <MoreHorizontal size={14} strokeWidth={2.5} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  className="absolute right-0 top-9 z-20 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden min-w-[110px]"
                  initial={{ opacity: 0, scale: 0.85, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <button
                    onClick={handleEditClick}
                    className="w-full text-left px-4 py-2.5 font-handwritten text-base text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                  >
                    Edit
                  </button>
                </motion.div>
              </>
            )}
          </div>

          {/* Media (Click to zoom lightbox) */}
          <div
            onClick={() => setIsZoomed(true)}
            className="relative overflow-hidden bg-zinc-100 cursor-pointer group/media"
            style={{ aspectRatio: '4/3' }}
            title="Klik untuk perbesar"
          >
            {memory.type === 'video' ? (
              <video
                src={memory.mediaUrl}
                autoPlay muted loop playsInline
                className="w-full h-full object-cover pointer-events-none"
                aria-label={memory.title}
              />
            ) : (
              <img
                src={memory.mediaUrl}
                alt={memory.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}

            {/* Hover zoom icon */}
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-zinc-700 shadow-sm">
                <Maximize2 size={14} />
              </span>
            </div>

            <div className="absolute top-2 left-2 pointer-events-none">
              <span className="date-stamp">{formatDate(memory.uploadDate)}</span>
            </div>

            {memory.type === 'video' && (
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <span className="date-stamp text-xs">video</span>
              </div>
            )}
          </div>

          {/* Caption + category badge */}
          <div className="pt-2 pb-0.5 px-0.5 text-center md:pt-3 md:pb-1 md:px-1">
            <p
              onClick={() => setIsZoomed(true)}
              className="font-handwritten text-sm md:text-lg font-semibold text-zinc-700 leading-tight cursor-pointer hover:text-zinc-900 transition-colors"
            >
              {memory.title}
            </p>
            {category && (
              <span className={`inline-block mt-1 text-[0.55rem] md:text-[0.65rem] font-handwritten px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                {category.icon && <span className="mr-0.5">{category.icon}</span>}
                {category.name}
              </span>
            )}
          </div>
        </motion.article>

        {/* Comments outside polaroid so they're never clipped */}
        <div className="px-2">
          <FloatingComments
            memoryId={memory.id}
            comments={memory.comments || []}
            onAddComment={onAddComment}
          />
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <PhotoLightboxModal
        memory={memory}
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
        onAddComment={onAddComment}
        category={category}
      />
    </>
  );
}

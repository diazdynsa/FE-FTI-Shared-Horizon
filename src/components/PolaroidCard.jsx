import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Maximize2, Play } from 'lucide-react';
import { tapeVariants, rotations, formatDate } from '../data/memories';
import FloatingComments from './FloatingComments';
import PhotoLightboxModal from './PhotoLightboxModal';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: rotations[i % rotations.length],
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      delay: Math.min(i * 0.04, 0.25),
    },
  }),
};

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

  const handleCardClick = () => {
    setIsZoomed(true);
  };

  return (
    <>
      <div className="relative w-full">
        <motion.article
          id={`memory-${memory.id}`}
          onClick={handleCardClick}
          className="polaroid cursor-pointer mx-auto group relative select-none"
          style={{ width: '100%' }}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover={{
            scale: 1.02,
            rotate: 0,
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true, margin: '60px' }}
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
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
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

          {/* Media */}
          <div
            className="relative overflow-hidden bg-zinc-100 group/media"
            style={{ aspectRatio: '4/3' }}
          >
            {memory.type === 'video' ? (
              <div className="w-full h-full relative bg-zinc-900 flex items-center justify-center">
                <video
                  src={`${memory.mediaUrl}#t=0.1`}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover pointer-events-none opacity-85"
                  aria-label={memory.title}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center shadow-md group-hover/media:scale-110 transition-transform">
                    <Play size={15} className="ml-0.5 fill-zinc-800 text-zinc-800" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={memory.mediaUrl}
                alt={memory.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}

            {/* Hover zoom indicator */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="p-1.5 rounded-full bg-white/85 backdrop-blur-xs text-zinc-700 shadow-sm">
                <Maximize2 size={13} />
              </span>
            </div>

            <div className="absolute top-2 left-2 pointer-events-none">
              <span className="date-stamp">{formatDate(memory.uploadDate)}</span>
            </div>

            {memory.type === 'video' && (
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <span className="date-stamp text-xs flex items-center gap-1">
                  <Play size={8} className="fill-white" /> video
                </span>
              </div>
            )}
          </div>

          {/* Caption + category badge */}
          <div className="pt-2 pb-0.5 px-0.5 text-center md:pt-3 md:pb-1 md:px-1">
            <p className="font-handwritten text-sm md:text-lg font-semibold text-zinc-700 leading-tight">
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

        {/* Comments outside polaroid */}
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

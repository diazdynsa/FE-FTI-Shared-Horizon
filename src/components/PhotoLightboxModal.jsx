import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Play } from 'lucide-react';
import FloatingComments from './FloatingComments';
import { formatDate } from '../data/memories';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.75, y: 25 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 15,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

export default function PhotoLightboxModal({ memory, isOpen, onClose, onAddComment, category }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && memory && (
        <motion.div
          key={`lightbox-${memory.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-xs"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative flex flex-col items-center max-w-sm sm:max-w-md w-full my-auto origin-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-3.5 -right-2.5 sm:-top-3 sm:-right-3 z-30 w-8 h-8 rounded-full bg-zinc-900 text-white shadow-xl flex items-center justify-center hover:bg-zinc-700 transition-colors border border-white/20"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>

            {/* ── Zoomed Polaroid Card ── */}
            <div
              className="bg-white rounded-xs p-3 sm:p-4 pb-5 shadow-2xl relative w-full border border-zinc-200"
              style={{
                boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* Masking tape on top */}
              <div
                className="tape tape-top tape-pink"
                style={{ top: '-11px', left: '32%', width: '36%', zIndex: 10 }}
              />

              {/* Media Player / Image */}
              <div className="relative w-full bg-zinc-950 overflow-hidden rounded-xs flex items-center justify-center min-h-[220px] max-h-[60vh]">
                {memory.type === 'video' ? (
                  <video
                    src={memory.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[60vh] object-contain"
                  />
                ) : (
                  <img
                    src={memory.mediaUrl}
                    alt={memory.title}
                    className="w-full max-h-[60vh] object-contain bg-zinc-100"
                  />
                )}

                {/* Date stamp in corner */}
                <div className="absolute top-2 left-2 pointer-events-none z-10">
                  <span className="date-stamp text-xs flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(memory.uploadDate)}
                  </span>
                </div>
              </div>

              {/* Title and Category */}
              <div className="pt-3 sm:pt-4 text-center px-1">
                <h3 className="font-handwritten text-2xl sm:text-3xl font-bold text-zinc-800 leading-tight">
                  {memory.title}
                </h3>

                {category && (
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="font-handwritten text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600">
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Comments Section inside Lightbox */}
              <div className="mt-3 pt-2.5 border-t border-dashed border-zinc-200">
                <FloatingComments
                  memoryId={memory.id}
                  comments={memory.comments || []}
                  onAddComment={onAddComment}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

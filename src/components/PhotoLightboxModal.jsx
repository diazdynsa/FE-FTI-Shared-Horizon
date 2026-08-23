import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import FloatingComments from './FloatingComments';
import { formatDate } from '../data/memories';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
};

export default function PhotoLightboxModal({ memory, isOpen, onClose, onAddComment, category }) {
  if (!memory) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative flex flex-col items-center max-w-sm sm:max-w-md w-full my-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full bg-zinc-800 text-white shadow-lg flex items-center justify-center hover:bg-zinc-700 transition-colors"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>

            {/* ── Big Polaroid Card ── */}
            <div
              className="bg-white rounded-xs p-3 sm:p-4 pb-6 shadow-2xl relative w-full border border-zinc-200"
              style={{
                boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              }}
            >
              {/* Masking tape on top */}
              <div
                className="tape tape-top tape-pink"
                style={{ top: '-11px', left: '32%', width: '36%', zIndex: 10 }}
              />

              {/* Media Player / Image */}
              <div className="relative aspect-4/3 w-full bg-zinc-900 overflow-hidden rounded-xs">
                {memory.type === 'video' ? (
                  <video
                    src={memory.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={memory.mediaUrl}
                    alt={memory.title}
                    className="w-full h-full object-contain bg-zinc-100"
                  />
                )}

                {/* Date stamp in corner */}
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className="date-stamp text-xs flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(memory.uploadDate)}
                  </span>
                </div>
              </div>

              {/* Title and Category */}
              <div className="pt-4 text-center px-1">
                <h3 className="font-handwritten text-2xl sm:text-3xl font-bold text-zinc-800 leading-tight">
                  {memory.title}
                </h3>

                {category && (
                  <div className="mt-1.5 flex items-center justify-center gap-1">
                    <span className="font-handwritten text-xs px-3 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600">
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Comments Section inside Lightbox */}
              <div className="mt-4 pt-3 border-t border-dashed border-zinc-200">
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
    </AnimatePresence>
  );
}

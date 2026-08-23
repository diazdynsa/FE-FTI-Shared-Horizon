import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, ChevronDown, ChevronUp } from 'lucide-react';
import { stickyColors, colorCycle, stickyRotations } from '../data/memories';

const noteVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
      delay: Math.min(i * 0.04, 0.2),
    },
  }),
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.1 } },
};

export default function FloatingComments({ memoryId, comments, onAddComment }) {
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [authorText, setAuthorText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const color = colorCycle[comments.length % colorCycle.length];
    onAddComment(memoryId, {
      id: `c-${Date.now()}`,
      author: authorText.trim() || 'Anonim',
      text: inputText.trim(),
      color,
    });
    setInputText('');
    setAuthorText('');
  };

  // Decide how many to show
  const MAX_COLLAPSED = 3;
  const hasMore = comments.length > MAX_COLLAPSED;
  const visibleComments = expanded ? comments : comments.slice(-MAX_COLLAPSED);

  return (
    <div className="mt-3">
      {/* ── Sticky notes rendered as inline items below the photo ── */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-2">
          <AnimatePresence mode="popLayout">
            {visibleComments.map((comment, i) => {
              const colorClass = stickyColors[comment.color] || stickyColors.yellow;
              const rot = stickyRotations[i % stickyRotations.length];
              return (
                <motion.div
                  key={comment.id}
                  custom={i}
                  variants={noteVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  style={{
                    rotate: `${rot}deg`,
                    /* Alternate indent for scattered look */
                    marginLeft: i % 2 === 0 ? '4px' : '20px',
                    marginRight: i % 2 === 0 ? '16px' : '4px',
                  }}
                >
                  <div className={`${colorClass} rounded-sm text-xs md:text-sm shadow-xs`}>
                    <span className="font-bold text-[0.6rem] uppercase tracking-wider opacity-50 block">
                      {comment.author}
                    </span>
                    <span className="block mt-0.5 leading-snug">
                      {comment.text}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Show more / less toggle */}
          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors font-handwritten text-xs self-center"
            >
              {expanded ? (
                <><ChevronUp size={12} /> Sembunyikan</>
              ) : (
                <><ChevronDown size={12} /> +{comments.length - MAX_COLLAPSED} komentar lagi</>
              )}
            </button>
          )}
        </div>
      )}

      {/* ── Comment button + input ── */}
      <div className="flex items-center gap-2 px-1">
        <button
          onClick={() => setShowInput((v) => !v)}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors group"
          aria-label="Tambah komentar"
        >
          <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
          <span className="font-handwritten text-sm">
            {comments.length > 0 ? `${comments.length} coretan` : 'Coret sini...'}
          </span>
        </button>
      </div>

      {/* ── Inline comment form ── */}
      <AnimatePresence>
        {showInput && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onSubmit={handleSubmit}
            className="overflow-hidden mt-2 px-1"
          >
            <div className="flex flex-col gap-1.5 p-2.5 bg-white/50 rounded-lg border border-zinc-200/50 backdrop-blur-sm">
              <input
                type="text"
                value={authorText}
                onChange={(e) => setAuthorText(e.target.value)}
                placeholder="Nama kamu..."
                maxLength={20}
                className="comment-input text-xs"
              />
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tulis sesuatu..."
                  maxLength={80}
                  className="comment-input flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-1.5 rounded-full bg-zinc-800 text-white disabled:opacity-30 hover:bg-zinc-700 transition-colors flex-shrink-0"
                  aria-label="Kirim"
                >
                  <Send size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInput(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors flex-shrink-0"
                  aria-label="Tutup"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

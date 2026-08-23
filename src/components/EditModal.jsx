import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Save, Loader } from 'lucide-react';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 50 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.88, y: 40, transition: { duration: 0.18 } },
};

export default function EditModal({ memory, onClose, onSave, onDelete, categories }) {
  const [title, setTitle] = useState(memory?.title ?? '');
  const [categoryId, setCategoryId] = useState(memory?.categoryId ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setCategoryId(memory.categoryId ?? '');
      setConfirmDelete(false);
    }
  }, [memory]);

  useEffect(() => {
    if (memory) setTimeout(() => titleRef.current?.focus(), 100);
  }, [memory]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave({ ...memory, title: title.trim(), categoryId });
    setIsSaving(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDelete(memory.id);
  };

  const isOpen = !!memory;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
          variants={overlayVariants}
          initial="hidden" animate="visible" exit="hidden"
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label="Edit Kenangan"
        >
          <motion.div
            className="modal-paper rounded-2xl w-full max-w-sm p-6"
            variants={modalVariants}
            initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tape tape-pink" style={{ position: 'absolute', top: '-11px', left: '25%', width: '50%' }} />

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-handwritten text-2xl text-zinc-700 font-bold">Edit Kenangan</h2>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Preview thumbnail */}
            {memory && (
              <div className="polaroid mb-5 mx-4" style={{ pointerEvents: 'none' }}>
                <div className="relative overflow-hidden bg-zinc-100" style={{ aspectRatio: '4/3' }}>
                  {memory.type === 'video'
                    ? <video src={memory.mediaUrl} muted loop playsInline autoPlay className="w-full h-full object-cover" />
                    : <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" />
                  }
                </div>
                <p className="font-handwritten text-sm text-zinc-500 text-center pt-2 pb-1 leading-tight truncate px-1">
                  {title || '...'}
                </p>
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label htmlFor="edit-title" className="font-handwritten text-sm text-zinc-500">Caption</label>
                <input
                  ref={titleRef}
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 bg-white/70 text-zinc-700 font-handwritten text-lg placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:border-amber-300 transition-all"
                />
              </div>

              {/* Category */}
              {categories && categories.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label htmlFor="edit-category" className="font-handwritten text-sm text-zinc-500">Kategori</label>
                  <select
                    id="edit-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 bg-white/70 text-zinc-700 font-handwritten text-base focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:border-amber-300 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Tanpa kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <motion.button
                  type="button"
                  onClick={handleDelete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex-1 py-2.5 rounded-xl font-handwritten text-base font-bold flex items-center justify-center gap-2 transition-all border ${
                    confirmDelete
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-red-500 border-red-200 hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={15} />
                  {confirmDelete ? 'Yakin?' : 'Hapus'}
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={!title.trim() || isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-[2] py-2.5 rounded-xl font-handwritten text-base font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #4a3f35, #2f261e)' }}
                >
                  {isSaving ? <><Loader size={15} className="animate-spin" /> Menyimpan...</> : <><Save size={15} /> Simpan</>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

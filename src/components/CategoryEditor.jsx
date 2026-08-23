import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.12, ease: 'easeIn' } },
};

export default function CategoryEditor({ isOpen, onClose, categories, onSave }) {
  const [items, setItems] = useState(categories);

  const handleNameChange = (id, name) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const handleIconChange = (id, icon) => {
    // Take only the last character typed (so user can replace the icon)
    const char = icon.slice(-1) || '';
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, icon: char } : c)));
  };

  const handleAdd = () => {
    const newId = `cat-${Date.now()}`;
    setItems((prev) => [...prev, { id: newId, name: '', icon: '·' }]);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    const cleaned = items.filter((c) => c.name.trim());
    onSave(cleaned.map((c) => ({ ...c, name: c.name.trim() })));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="modal-paper rounded-2xl w-full max-w-sm p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tape tape-top" style={{ position: 'absolute', top: '-11px', left: '30%', width: '40%' }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-handwritten text-2xl text-zinc-700 font-bold">Kelola Kategori</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category list */}
            <div className="flex flex-col gap-3 mb-4 max-h-[280px] overflow-y-auto pr-1">
              {items.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  {/* Icon input — single character */}
                  <input
                    type="text"
                    value={cat.icon}
                    onChange={(e) => handleIconChange(cat.id, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-zinc-200 bg-white/70 text-center text-lg focus:outline-none focus:ring-2 focus:ring-amber-300/60 transition-all flex-shrink-0"
                    maxLength={2}
                    aria-label="Ikon kategori"
                  />
                  {/* Name input */}
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleNameChange(cat.id, e.target.value)}
                    placeholder="Nama kategori..."
                    maxLength={20}
                    className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 bg-white/70 text-zinc-700 font-handwritten text-base placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-300/60 transition-all"
                  />
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                    aria-label="Hapus kategori"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="w-full py-2 rounded-lg border border-dashed border-zinc-300 text-zinc-400 hover:text-zinc-600 hover:border-zinc-400 transition-colors flex items-center justify-center gap-2 font-handwritten text-sm mb-4"
            >
              <Plus size={14} /> Tambah kategori
            </button>

            {/* Save */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 rounded-xl font-handwritten text-base font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #4a3f35, #2f261e)' }}
            >
              Simpan
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
